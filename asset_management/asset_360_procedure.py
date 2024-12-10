import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from google.cloud.sql.connector import create_async_connector

from colorama import Fore, Style
from dotenv import load_dotenv

load_dotenv()  # load environment variables

async def init_connection_pool(connector):
    async def getconn():
        conn = await connector.connect_async(
            os.environ["INSTANCE_CONNECTION_NAME"],
            "asyncpg",
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            db=os.environ["DB_NAME"],
        )
        return conn

    pool = create_async_engine(
        "postgresql+asyncpg://",
        async_creator=getconn,
    )
    return pool

async def create_and_run_procedure(Session):
    procedure_sql = """
    CREATE OR REPLACE PROCEDURE create_asset_360()
    LANGUAGE plpgsql
    AS $$
    BEGIN
        -- 1. Basic Asset Information with Current Values
        CREATE TEMPORARY TABLE temp_basic_info AS
        SELECT 
            am.*,
            md.closing_price as current_price,
            (md.closing_price * pa.actual_percentage) as market_value
        FROM asset_master am
        LEFT JOIN market_data md ON am.asset_id = md.asset_id
        LEFT JOIN portfolio_allocation pa ON am.asset_id = pa.asset_id
        WHERE md.price_date = (
            SELECT MAX(price_date) 
            FROM market_data md2 
            WHERE md2.asset_id = am.asset_id
        );

        -- 2. Performance Metrics
        CREATE TEMPORARY TABLE temp_performance AS
        SELECT 
            asset_id,
            AVG(daily_return) as avg_daily_return,
            MAX(daily_return) as max_daily_return,
            MIN(daily_return) as min_daily_return,
            AVG(total_return) as total_return
        FROM performance_history
        WHERE date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY asset_id;

        -- 3. Risk Profile
        CREATE TEMPORARY TABLE temp_risk_profile AS
        SELECT 
            asset_id,
            AVG(volatility) as avg_volatility,
            AVG(var_95) as value_at_risk,
            AVG(beta) as beta,
            AVG(sharpe_ratio) as sharpe_ratio
        FROM risk_metrics
        WHERE calculation_date >= CURRENT_DATE - INTERVAL '3 months'
        GROUP BY asset_id;

        -- 4. Transaction Summary
        CREATE TEMPORARY TABLE temp_transaction_summary AS
        SELECT 
            asset_id,
            COUNT(*) as total_transactions,
            SUM(CASE WHEN transaction_type = 'BUY' THEN total_amount ELSE 0 END) as total_purchases,
            SUM(CASE WHEN transaction_type = 'SELL' THEN total_amount ELSE 0 END) as total_sales,
            AVG(transaction_costs) as avg_transaction_cost
        FROM transactions
        WHERE transaction_date >= CURRENT_DATE - INTERVAL '1 year'
        GROUP BY asset_id;

        -- 5. Compliance Status
        CREATE TEMPORARY TABLE temp_compliance AS
        SELECT 
            asset_id,
            COUNT(CASE WHEN status = 'VIOLATION' THEN 1 END) as active_violations,
            MAX(check_date) as last_compliance_check
        FROM compliance_records
        WHERE check_date >= CURRENT_DATE - INTERVAL '6 month'
        GROUP BY asset_id;

        -- 6. Create Final Asset 360 Table
        DROP TABLE IF EXISTS asset_360;
        CREATE TABLE asset_360 AS
        SELECT 
            bi.*,
            p.avg_daily_return,
            p.total_return,
            rp.avg_volatility,
            rp.value_at_risk,
            rp.beta,
            rp.sharpe_ratio,
            ts.total_transactions,
            ts.total_purchases,
            ts.total_sales,
            ts.avg_transaction_cost,
            c.active_violations,
            c.last_compliance_check,
            CASE 
                WHEN ABS(rp.value_at_risk) > 2600 THEN 'HIGH'
                WHEN ABS(rp.value_at_risk) > 2500 THEN 'MEDIUM'
                ELSE 'LOW'
            END as risk_category,
            CASE 
                WHEN p.total_return > 0.15 THEN 'OUTPERFORMING'
                WHEN p.total_return < 0.04 THEN 'UNDERPERFORMING'
                ELSE 'NEUTRAL'
            END as performance_category,
            CASE
                WHEN bi.market_value > 1000000 THEN 'LARGE'
                WHEN bi.market_value > 100000 THEN 'MEDIUM'
                ELSE 'SMALL'
            END as position_size
        FROM temp_basic_info bi
        LEFT JOIN temp_performance p ON bi.asset_id = p.asset_id
        LEFT JOIN temp_risk_profile rp ON bi.asset_id = rp.asset_id
        LEFT JOIN temp_transaction_summary ts ON bi.asset_id = ts.asset_id
        LEFT JOIN temp_compliance c ON bi.asset_id = c.asset_id;

        -- Clean up temporary tables
        DROP TABLE temp_basic_info, temp_performance, temp_risk_profile, 
                temp_transaction_summary, temp_compliance;

    END;
    $$;
"""

    async with Session() as session:
        try:
            # Create the procedure
            await session.execute(text(procedure_sql))
            await session.commit()
            print("Procedure created successfully.")

            # Execute the procedure
            await session.execute(text("CALL create_asset_360()"))
            await session.commit()
            print("Procedure executed successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            await session.rollback()

async def main():
    print(f"{Fore.GREEN}{Style.BRIGHT}[+] Trying to connect...{Style.RESET_ALL}") 

    connector = await create_async_connector()
    engine = await init_connection_pool(connector)
    Session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

    try:
        print(f"{Fore.GREEN}{Style.BRIGHT}[+] Connection established.{Style.RESET_ALL}")
        await create_and_run_procedure(Session)
        return True
    except Exception as e:
        print(f"{Fore.RED}{Style.BRIGHT}[-] Unable to establish connection: {Style.RESET_ALL}{e}")
        return False

    finally:
        if engine:
            await engine.dispose()
            print(f"{Fore.GREEN}{Style.BRIGHT}[+] Connection pool disposed.{Style.RESET_ALL}")
        await connector.close_async()

if __name__ == "__main__":
    asyncio.run(main())