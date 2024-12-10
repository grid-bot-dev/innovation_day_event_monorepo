table_schema_init_queries = {
    "asset_master": """CREATE TABLE IF NOT EXISTS asset_master (
        asset_id SERIAL PRIMARY KEY,
        asset_name TEXT,
        asset_type TEXT,
        isin TEXT UNIQUE,
        currency TEXT,
        issuer TEXT,
        issue_date DATE,
        maturity_date DATE,
        par_value DECIMAL(15,2),
        rating TEXT,
        status TEXT,
        sector TEXT,
        issuing_country TEXT
    );""",
    "market_data": """CREATE TABLE IF NOT EXISTS market_data (
        data_id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        price_date DATE,
        closing_price DECIMAL(15,2),
        opening_price DECIMAL(15,2),
        high_price DECIMAL(15,2),
        low_price DECIMAL(15,2),
        volume INTEGER,
        bid_price DECIMAL(15,2),
        ask_price DECIMAL(15,2),
        yield_rate DECIMAL(10,4)
    );""",
    "transactions": """CREATE TABLE IF NOT EXISTS transactions (
        transaction_id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        transaction_date DATE,
        transaction_type TEXT,
        quantity DECIMAL(15,2),
        price DECIMAL(15,2),
        total_amount DECIMAL(15,2),
        counterparty_id INTEGER,
        portfolio_id INTEGER,
        transaction_costs DECIMAL(15,2)
    );""",
    "portfolio_allocation": """CREATE TABLE IF NOT EXISTS portfolio_allocation (
        allocation_id SERIAL PRIMARY KEY,
        portfolio_id INTEGER,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        target_percentage DECIMAL(5,2),
        actual_percentage DECIMAL(5,2),
        last_rebalance_date DATE
    );""",
    "risk_metrics": """CREATE TABLE IF NOT EXISTS risk_metrics (
        metric_id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        calculation_date DATE,
        volatility DECIMAL(10,4),
        beta DECIMAL(10,4),
        sharpe_ratio DECIMAL(10,4),
        var_95 DECIMAL(10,4),
        tracking_error DECIMAL(10,4)
    );""",
    "compliance_records": """CREATE TABLE IF NOT EXISTS compliance_records (
        compliance_id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        check_date DATE,
        rule_id INTEGER,
        rule_description TEXT,
        status TEXT,
        violation_details TEXT
    );""",
    "performance_history": """CREATE TABLE IF NOT EXISTS performance_history (
        performance_id SERIAL PRIMARY KEY,
        asset_id INTEGER REFERENCES asset_master(asset_id),
        date DATE,
        daily_return DECIMAL(10,4),
        mtd_return DECIMAL(10,4),
        ytd_return DECIMAL(10,4),
        total_return DECIMAL(10,4)
    );""",
    "counterparty_info": """CREATE TABLE IF NOT EXISTS counterparty_info (
        counterparty_id SERIAL PRIMARY KEY,
        name TEXT,
        type TEXT,
        rating TEXT,
        country TEXT,
        status TEXT
    );"""
}
