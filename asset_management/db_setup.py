import sys, os
sys.path.append(os.getcwd())

import random, datetime
import asyncio, asyncpg

from sqlalchemy.ext.asyncio import create_async_engine, AsyncEngine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import text
from asyncpg import Connection

from google.cloud.sql.connector import Connector, create_async_connector

from typing import List, Dict, Any
from colorama import Fore, Style
from datetime import date, timedelta
from collections import defaultdict
from dotenv import load_dotenv

from asset_management.db_setup_queries import table_schema_init_queries
from asset_management.db_static_data import assets, rule_descriptions, company_names, ratings, countries, types

load_dotenv()  # load environment variables

async def init_connection_pool(connector: Connector) -> AsyncEngine:
    async def getconn() -> Connection:
        conn: asyncpg.Connection = await connector.connect_async(
            os.environ[
                "INSTANCE_CONNECTION_NAME"
            ],  # Cloud SQL instance connection name
            "asyncpg",
            user=os.environ["DB_USER"],
            password=os.environ["DB_PASS"],
            db=os.environ["DB_NAME"],
        )
        return conn

    pool = create_async_engine(
        "postgresql+asyncpg://",  # Asyncpg driver
        async_creator=getconn,  # Use async connection creator
    )
    return pool

async def initiate_schema(Session, table_schema_init_queries: dict):
    try:
        async with Session() as session:
            # Iterate over the schema creation queries
            for table_name, create_query in table_schema_init_queries.items():
                try:
                    print(
                        f"{Fore.BLUE}{Style.BRIGHT}[+] Creating table {table_name}...{Style.RESET_ALL}"
                    )

                    # Execute the CREATE TABLE statement
                    await session.execute(text(create_query))

                    # Check if the table was created successfully by querying the information schema
                    result = await session.execute(
                        text(
                            f"SELECT * FROM information_schema.tables WHERE table_name='{table_name}';"
                        )
                    )
                    result = result.fetchall()

                    if result:
                        print(
                            f"{Fore.BLUE}{Style.BRIGHT}[+] Table {table_name} created successfully...{Style.RESET_ALL}\n"
                        )
                    else:
                        print(
                            f"{Fore.RED}{Style.BRIGHT}[-] Failed to create table {table_name}, no table found in information_schema.{Style.RESET_ALL}\n"
                        )

                except Exception as query_error:
                    print(
                        f"{Fore.RED}{Style.BRIGHT}[-] Error creating table {table_name}: {query_error}{Style.RESET_ALL}\n"
                    )

            # Commit the transaction after all tables have been processed
            await session.commit()  # Commit the transaction to persist changes

            print(
                f"{Fore.GREEN}{Style.BRIGHT}[+] Database Schema initialization process completed.{Style.RESET_ALL}\n",
                end="\n\n",
            )
            return True

    except Exception as e:
        print(
            f"{Fore.RED}{Style.BRIGHT}[-] An error occurred while creating tables: {e}{Style.RESET_ALL}",
            end="\n\n",
        )
    return False

async def bulk_insert(session: AsyncSession, table_name: str, data: list, batch_size: int = 500):
    try:
        columns = list(data[0].keys())
        placeholders = ", ".join(
            [f":{col}" for col in columns]
        )  # SQLAlchemy style placeholders
        column_names = ", ".join(columns)
        query = f"INSERT INTO {table_name} ({column_names}) VALUES ({placeholders})"

        # Insert data in batches asynchronously
        for i in range(0, len(data), batch_size):
            batch_data = data[i : i + batch_size]
            await session.execute(
                text(query), batch_data
            )  # Execute the query using the session
            print(
                f"{Fore.BLUE}{Style.BRIGHT}Successfully inserted {len(batch_data)} rows into {table_name}{Style.RESET_ALL}"
            )

    except Exception as e:
        print(
            f"{Fore.RED}{Style.BRIGHT}Error inserting data into {table_name}: {str(e)}{Style.RESET_ALL}"
        )
        raise  # Rethrow the exception to handle rollback in the calling function

async def insert_fake_data(Session: AsyncSession):
    # Prepare data for bulk inserts
    num_portfolios, num_days, num_violations = 20, 365, 6
    start_date = "2024-01-01"
   
    asset_master = create_asset_master_data(assets)
    market_data = create_market_data(asset_master)
    transaction_data = create_transaction_data(market_data, asset_master, num_portfolios)
    portfolio_allocation_data = create_portfolio_allocation_data(transaction_data)
    risk_metrics_data = create_risk_metrics_data(asset_master, start_date, num_days)
    compliance_data = create_compliance_data(asset_master, rule_descriptions, num_violations)
    performance_data = performance_history(market_data)
    counterparty_info = create_counterparty_info(company_names, ratings, countries, types)

    async with Session() as session:
        try:
            # Step 1: Insert parent table data(Parent in Foreign Key relation) (customer_info, product_catalog, marketing_campaigns) in parallel
            await asyncio.gather(
                bulk_insert(session, "asset_master", asset_master),
                bulk_insert(session, "counterparty_info", counterparty_info)
            )
            await session.commit()  # Commit the transaction after the first stage of inserts

            # Step 2: Insert child table data(Child in Foreign Key relation) (purchase_transactions, customer_service, campaign_responses, website_behavior) in parallel
            await asyncio.gather(
                bulk_insert(session, "market_data", market_data),
                bulk_insert(session, "transactions", transaction_data),
                bulk_insert(session, "portfolio_allocation", portfolio_allocation_data),
                bulk_insert(session, "risk_metrics", risk_metrics_data),
                bulk_insert(session, "compliance_records", compliance_data),
                bulk_insert(session, "performance_history", performance_data)
            )
            await session.commit()  # Commit the transaction after the second stage of inserts
            return True
        except Exception as e:
            await session.rollback()  # Rollback if an error occurs
            print(
                f"{Fore.RED}{Style.BRIGHT}[-] An error occurred while inserting data: {e}{Style.RESET_ALL}",
                end="\n\n",
            )
            print(e)
            return False

def random_date(start_year: int, end_year: int):
    """Generates a random date between two years in yyyy-mm-dd format."""
    start_date = date(start_year, 1, 1)
    end_date = date(end_year, 12, 31)
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_date = start_date + timedelta(days=random_days)
    return random_date

def create_asset_master_data(assets:list[dict])->list[dict]:
    for asset in assets:
        if asset["asset_type"].lower() == "bond":
            asset["maturity_date"] = random_date(2030, 2050)
        else:
            asset["maturity_date"] = None
            asset["par_value"] = None
        asset["status"] = "active"
    return assets

def create_market_data(updated_assets: list[dict], num_days: int = 365)->list[dict]:
    # Function to generate a random float using Gaussian distribution
    def gaussian_random(mean, std_dev):
        return random.gauss(mean, std_dev)

    # Function to generate market data for "num_days" days starting from 2024-01-01
    market_data = []
    start_date = date(2024, 1, 1)

    for day in range(num_days):
        current_date = start_date + timedelta(days=day)

        for asset in updated_assets:
            # Generate "mean_price" and "std_dev"
            mean_price = gaussian_random(5000, 500)
            std_dev = gaussian_random(40, 10)
            std_dev = max(std_dev, 5)  # Ensure std_dev is at least 5

            # Generate a list of 24 stock prices based on Gaussian distribution
            stock_prices = [gaussian_random(mean_price, std_dev) for _ in range(24)]

            # Market data dictionary for the current asset on the current day
            asset_data = {
                "data_id": len(market_data) + 1,
                "asset_id": asset["asset_id"],
                "price_date": current_date,
                "opening_price": round(stock_prices[0], 3), 
                "closing_price": round(stock_prices[-1], 3), 
                "high_price": round(max(stock_prices), 3), 
                "low_price": round(min(stock_prices), 3), 
                "volume": random.randint(1000, 20000),
                "bid_price": round(random.choice(stock_prices), 3), 
                "ask_price": round(random.choice(stock_prices), 3), 
                "yield_rate": round(random.uniform(0.01, 10), 3) 
            }

            market_data.append(asset_data)

    return market_data

def create_transaction_data(market_data: list[dict], updated_assets: list[dict], num_portfolios: int , num_days: int = 365)-> list[dict]:
    # Dictionary to index market data by asset_id and date for quick lookup
    market_data_lookup = {}
    for data in market_data:
        market_data_lookup.setdefault(data["asset_id"], {})[data["price_date"].strftime('%Y-%m-%d')] = data

    # Initialize the transaction data list
    transaction_data = []

    # Start from the given date and iterate for num_days days
    start_date = date(2024, 1, 1)
    for day in range(num_days):
        current_date = start_date + timedelta(days=day)

        # Generate a random number of transactions for the day
        num_transactions = random.randint(10, 100)

        for _ in range(num_transactions):
            # Randomly pick an asset from the updated_assets list
            asset = random.choice(updated_assets)
            asset_id = asset["asset_id"]

            # Get the market data for the current asset on the current date
            market_data_for_asset = market_data_lookup.get(asset_id, {}).get(current_date.strftime('%Y-%m-%d'))
            if not market_data_for_asset:
                print(f"[+] No market data available for asset_id: {asset_id} on date: {current_date}")
                continue  # Skip if no market data available for this asset on the date

            # Generate a random price between low_price and high_price
            low_price = market_data_for_asset["low_price"]
            high_price = market_data_for_asset["high_price"]
            price = round(random.uniform(low_price, high_price), 3)

            # Randomly initialize transaction details
            quantity = random.randint(1, 500)
            transaction = {
                "transaction_id": len(transaction_data),
                "asset_id": asset_id,
                "transaction_date": current_date,
                "transaction_type": random.choice(["BUY", "SELL"]),
                "quantity": quantity,
                "price": price,
                "total_amount": round(quantity * price, 3),
                "counterparty_id": random.randint(0, 20),
                "portfolio_id": random.randint(0, num_portfolios),
                "transaction_costs": round(random.uniform(10, 30), 3)
            }
            # Add the transaction to the list
            transaction_data.append(transaction)

    return transaction_data

def create_portfolio_allocation_data(transaction_data: list[dict], num_days: int = 365)-> list[dict]:
    # Group transactions by (portfolio_id, transaction_date)
    grouped_transactions = defaultdict(list)
    for transaction in transaction_data:
        key = (transaction["portfolio_id"], transaction["transaction_date"].strftime('%Y-%m-%d'))
        grouped_transactions[key].append(transaction)

    # Initialize the portfolio allocation data list
    portfolio_allocation_data = []

    # Generate a date range for rebalance dates
    start_date = date(2024, 1, 1)
    end_date = start_date + timedelta(days=num_days)

    # Iterate over each group
    for (portfolio_id, transaction_date), transactions in grouped_transactions.items():
        # Randomly assign target and actual percentages
        num_transactions = len(transactions)
        target_percentages = [random.uniform(5, 50) for _ in range(num_transactions)]
        actual_percentages = [random.uniform(5, 50) for _ in range(num_transactions)]

        # Normalize percentages to sum to 100
        target_total = sum(target_percentages)
        actual_total = sum(actual_percentages)
        target_percentages = [(x / target_total) * 100 for x in target_percentages]
        actual_percentages = [(x / actual_total) * 100 for x in actual_percentages]

        # Generate portfolio allocation records
        for i, transaction in enumerate(transactions):
            portfolio = {
                "allocation_id": len(portfolio_allocation_data),
                "portfolio_id": portfolio_id,
                "asset_id": transaction["asset_id"],
                "target_percentage": round(target_percentages[i], 3),
                "actual_percentage": round(actual_percentages[i], 3),
                "last_rebalance_date": (datetime.datetime.strptime(transaction_date, '%Y-%m-%d') - timedelta(days=random.randint(10, 100)))
            }
            portfolio_allocation_data.append(portfolio)

    return portfolio_allocation_data

def create_risk_metrics_data(updated_assets: list[dict], start_date: list[dict], num_days: list[dict])-> list[dict]:
    # Parse the start_date
    start_date = date.fromisoformat(start_date)
    
    # Initialize the risk metrics data list
    risk_metrics_data = []
    
    # Iterate through the date range
    for day_offset in range(num_days):
        current_date = start_date + timedelta(days=day_offset)
        current_date_str = current_date
        
        # Iterate over each asset
        for asset in updated_assets:
            # Initialize the risk profile dictionary
            risk_profile = {
                "metric_id": len(risk_metrics_data),
                "asset_id": asset["asset_id"],
                "calculation_date": current_date_str,
                "volatility": round(random.uniform(0.01, 2.0), 3),  # Reasonable fluctuation
                "beta": round(random.uniform(-1.5, 2.0), 3),  # Sensitivity to market
                "sharpe_ratio": round(random.uniform(-0.5, 3.0), 3),  # Risk-adjusted return
                "var_95": round(random.uniform(-5000, -100), 2),  # Potential loss at 95% confidence
                "tracking_error": round(random.uniform(0.01, 0.5), 3),  # Difference from benchmark
            }
            # Add the risk profile to the list
            risk_metrics_data.append(risk_profile)
    
    return risk_metrics_data

def create_compliance_data(updated_assets: list[dict], rule_descriptions:dict, num_violations: int, num_days: int=365)->list[dict]:
    # Step 1: Validate num_violations
    assert num_violations < len(updated_assets), "Number of violations exceeded the total number of assets registered on the platform."
    
    # Step 2: Randomly select assets for violations
    violated_assets = random.sample(updated_assets, num_violations) 
    
    # Step 4: Generate compliance data
    compliance_data = []
    start_date = date(2024, 1, 1)
    end_date = start_date + timedelta(days=num_days)
    
    for asset in violated_assets:
        asset_type = asset["asset_type"].lower()
        rule_id, violation_details = random.choice(rule_descriptions[asset_type])
        
        compliance_violated = {
            "compliance_id": len(compliance_data),
            "asset_id": asset["asset_id"],
            "check_date": (start_date + timedelta(days=random.randint(0, num_days))),
            "rule_id": random.randint(1, 1000),
            "rule_description": rule_id,
            "status": "VIOLATION",
            "violation_details": violation_details
        }
        compliance_data.append(compliance_violated)
    
    return compliance_data

def performance_history(market_data:list[dict])->list[dict]:
    performance_data = []
    
    for record in market_data:
        # Initialize the performance dict
        performance = {
            "performance_id": len(performance_data),
            "asset_id": record["asset_id"],
            "date": record["price_date"],
            "daily_return": 0.0,
            "mtd_return": 0.0,
            "ytd_return": 0.0,
            "total_return": 0.0
        }
        
        # Calculate daily return as the percentage change between opening and closing price
        opening_price = record["opening_price"]
        closing_price = record["closing_price"]
        performance["daily_return"] = round((closing_price - opening_price) / opening_price, 3)
        
        # Generate realistic returns for MTD, YTD, and Total Return
        # These are approximations based on asset price characteristics.
        
        # MTD (Month-to-Date) Return: Let's assume it's within a realistic range based on volatility.
        mtd_return = random.uniform(-0.15, 0.2)  # Random value between -5% and +10%
        performance["mtd_return"] = round(mtd_return, 3)
        
        # YTD (Year-to-Date) Return: Similar approach, but based on the market conditions and yield rate.
        ytd_return = random.uniform(-0.1, 0.8)  # Random value between -10% and +20%
        performance["ytd_return"] = round(ytd_return, 3)
        
        # Total Return: Total return can also be realistically generated, considering market trends.
        mean_return, std_dev = None, None
        if (record['asset_id'] >  17):
            mean_return, std_dev = 0.18, 0.1
        elif (record['asset_id'] > 7):
            mean_return, std_dev = 0.10, 0.2
        else:
            mean_return, std_dev = 0.01, 0.05
        total_return = random.gauss(mean_return, std_dev)  # Gaussian distribution with mean=0.18 and std=0.2
        performance["total_return"] = round(total_return, 3)
        
        # Append to the performance data list
        performance_data.append(performance)
    
    return performance_data

def create_counterparty_info(company_names: list, ratings: list, countries: list, types: list)->list[dict]:
    # Generate the list of counterparty dictionaries
    counterparties = []
    for name in company_names:
        counterparty = {
            "counterparty_id": random.randint(1, 1000000),
            "name": name,
            "type": random.choice(types),
            "rating": random.choice(ratings),
            "country": random.choice(countries),
            "status": "ACTIVE"
        }
        counterparties.append(counterparty)

    return counterparties

async def main():
    print(
        f"{Fore.GREEN}{Style.BRIGHT}[+] Trying to connect....{Style.RESET_ALL}",
        end="\n\n",
    )

    connector = await create_async_connector()  # Initialize Cloud SQL Connector
    engine = await init_connection_pool(connector)  # Initialize connection pool
    Session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)  # session manager

    try:
        print(
            f"{Fore.GREEN}{Style.BRIGHT}[+] Connection established.{Style.RESET_ALL}",
            end="\n\n",
        )
        db_init = await initiate_schema(Session, table_schema_init_queries)

        print(
            f"{Fore.GREEN}{Style.BRIGHT}[+] Begginning data insertion into db.{Style.RESET_ALL}",
            end="\n\n",
        )
        try:
            result = await insert_fake_data(Session)
            if result:
                print(
                    f"{Fore.GREEN}{Style.BRIGHT}[+] Database initialised successfully with data.{Style.RESET_ALL}",
                    end="\n\n",
                )

        except Exception as e:
            print(
                f"{Fore.RED}{Style.BRIGHT}[-] Unable to insert into db.{Style.RESET_ALL}"
            )
            print(e, end="\n\n")

    except Exception as e:
        print(
            f"{Fore.RED}{Style.BRIGHT}[-] Unable to establish connection.{Style.RESET_ALL}",
            end="\n\n",
        )
        print(e)

    finally:
        # Ensure the connection pool is disposed
        if engine:
            await engine.dispose()
            print(
                f"{Fore.GREEN}{Style.BRIGHT}Connection pool disposed.{Style.RESET_ALL}"
            )
        await connector.close_async()  # Ensure the Cloud SQL Connector is properly closed

# Run the async main function
if __name__ == "__main__":
    asyncio.run(main())