import os
import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from google.cloud.sql.connector import create_async_connector
from dotenv import load_dotenv
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import json

load_dotenv() # load the environment variables

async def init_connection_pool():
    connector = await create_async_connector()
    async def getconn():
        conn = await connector.connect_async(
            os.environ["INSTANCE_CONNECTION_NAME"],
            "asyncpg",
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            db=os.environ["DB_NAME"],
        )
        return conn

    engine = create_async_engine(
        "postgresql+asyncpg://",
        async_creator=getconn,
    )
    return engine, connector

async def get_db_session(engine):
    async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    return async_session()

async def get_portfolio_overview():
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            total_assets = await session.execute(
                text("SELECT COUNT(DISTINCT asset_id) as total_assets FROM asset_360")
            )
            total_assets = (total_assets.fetchone())[0]

            total_value = await session.execute(
                text("SELECT SUM(market_value) as total_value FROM asset_360")
            )
            total_value = (total_value.fetchone())[0]

            avg_return = await session.execute(
                text("SELECT AVG(total_return) as avg_return FROM asset_360")
            )
            avg_return = (avg_return.fetchone())[0]

            portfolio_risk = await session.execute(
                text("""
                    SELECT risk_category, COUNT(*) as count 
                    FROM asset_360 
                    GROUP BY risk_category
                """)
            )
            risk_distribution = pd.DataFrame(portfolio_risk.fetchall(), 
                                          columns=['risk_category', 'count'])

            return {
                "total_assets": total_assets,
                "total_value": round(total_value, 2),
                "average_return": round(avg_return * 100, 2),
                "risk_distribution": risk_distribution.to_dict(orient="records")
            }
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_asset_allocation():
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT asset_type, 
                           SUM(market_value) as total_value,
                           COUNT(*) as asset_count
                    FROM asset_360
                    GROUP BY asset_type
                """)
            )
            df = pd.DataFrame(result.fetchall(), 
                            columns=['asset_type', 'total_value', 'asset_count'])
            
            fig = px.pie(df, values='total_value', names='asset_type', 
                        title='Asset Allocation by Type')
            return json.loads(fig.to_json())
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_risk_metrics():# changed SQL query to ensure distinct asset_ids are fetched
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT DISTINCT asset_id, asset_name, value_at_risk, beta, sharpe_ratio
                    FROM asset_360
                    ORDER BY value_at_risk DESC
                    LIMIT 5
                """)
            )
            df = pd.DataFrame(result.fetchall(), 
                            columns=['asset_id', 'asset_name', 'var', 
                                   'beta', 'sharpe_ratio'])
            return df.to_dict(orient="records")
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_performance_dashboard(): # changed SQL query to ensure distinct asset_names are fetched
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT DISTINCT(asset_name), total_return, avg_daily_return,
                           avg_volatility, performance_category
                    FROM asset_360
                    WHERE total_return IS NOT NULL
                    ORDER BY total_return DESC
                    LIMIT 5
                """)
            )
            top_performers = pd.DataFrame(
                result.fetchall(),
                columns=['asset_name', 'total_return', 'avg_daily_return',
                        'avg_volatility', 'performance_category']
            )

            return {
                "top_performers": top_performers.to_dict(orient="records")
            }
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_compliance_summary(): # changed SQL query to ensure distinct asset_names are fetched
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT DISTINCT(asset_name), active_violations, 
                           last_compliance_check
                    FROM asset_360
                    WHERE active_violations > 0
                    ORDER BY active_violations DESC
                """)
            )
            violations = pd.DataFrame(
                result.fetchall(),
                columns=['asset_name', 'active_violations',
                        'last_compliance_check']
            )
            return violations.to_dict(orient="records")
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_transaction_analysis():
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT DATE_TRUNC('month', t.transaction_date) as month,
                           SUM(t.total_amount) as volume
                    FROM transactions t
                    WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '12 months'
                    GROUP BY month
                    ORDER BY month
                """)
            )
            df = pd.DataFrame(result.fetchall(), columns=['month', 'volume'])
            
            fig = px.line(df, x='month', y='volume', 
                         title='Monthly Transaction Volume')
            return json.loads(fig.to_json())
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_sector_exposure():
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT sector, COUNT(sector) from asset_360 GROUP BY sector;
                """)
            )
            df = pd.DataFrame(result.fetchall(), columns=['sector', 'count'])
            df['percentage_share'] = df['count'] / df['count'].sum()

            fig = px.pie(df, values='percentage_share', names='sector', 
                        title='Percentage Share in Different Sectors')
            return json.loads(fig.to_json())
    finally:
        await engine.dispose()
        await connector.close_async()

async def get_geographic_distribution():
    engine, connector = await init_connection_pool()
    try:
        async with await get_db_session(engine) as session:
            result = await session.execute(
                text("""
                    SELECT issuing_country, COUNT(issuing_country) from asset_360 GROUP BY issuing_country;
                """)
            )
            df = pd.DataFrame(result.fetchall(), columns=['issuing_country', 'count'])
            df['percentage_share'] = df['count'] / df['count'].sum()

            fig = px.pie(df, values='percentage_share', names='issuing_country', 
                        title='Percentage Investement in Different Countries')
            return json.loads(fig.to_json())
    finally:
        await engine.dispose()
        await connector.close_async()


