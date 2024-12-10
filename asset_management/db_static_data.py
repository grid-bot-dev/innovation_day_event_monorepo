import datetime

assets = [
    {
        "asset_name": "TechCorp Bond 2025",
        "asset_id": 1,
        "asset_type": "Bond",
        "isin": "US1234567890",
        "currency": "USD",
        "issuer": "TechCorp Inc.",
        "issue_date": datetime.datetime.strptime("2022-05-15", "%Y-%m-%d").date(),
        "rating": "AA",
        "par_value": 1000,
        "sector": "Technology",
        "issuing_country": "United States"
    },
    {
        "asset_name": "GreenEnergy Stock",
        "asset_id": 2,
        "asset_type": "Stock",
        "isin": "GB9876543210",
        "currency": "GBP",
        "issuer": "GreenEnergy Ltd.",
        "issue_date": datetime.datetime.strptime("2015-03-10", "%Y-%m-%d").date(),
        "rating": "A",
        "par_value": 500,
        "sector": "Energy",
        "issuing_country": "United Kingdom"
    },
    {
        "asset_name": "Prime Realty Fund",
        "asset_id": 3,
        "asset_type": "Real Estate",
        "isin": "CA5647382910",
        "currency": "CAD",
        "issuer": "Prime Realty Corp.",
        "issue_date": datetime.datetime.strptime("2020-09-25", "%Y-%m-%d").date(),
        "rating": "AAA",
        "par_value": 2500,
        "sector": "Real Estate",
        "issuing_country": "Canada"
    },
    {
        "asset_name": "AutoMakers Bond 2030",
        "asset_id": 4,
        "asset_type": "Bond",
        "isin": "DE1122334455",
        "currency": "EUR",
        "issuer": "AutoMakers AG",
        "issue_date": datetime.datetime.strptime("2021-07-01", "%Y-%m-%d").date(),
        "rating": "BBB+",
        "par_value": 2000,
        "sector": "Automotive",
        "issuing_country": "Germany"
    },
    {
        "asset_name": "Healthcare Innovations Stock",
        "asset_id": 5,
        "asset_type": "Stock",
        "isin": "JP5544332211",
        "currency": "JPY",
        "issuer": "Healthcare Innovations Ltd.",
        "issue_date": datetime.datetime.strptime("2018-11-20", "%Y-%m-%d").date(),
        "rating": "A+",
        "par_value": 750,
        "sector": "Healthcare",
        "issuing_country": "Japan"
    },
    {
        "asset_name": "Blue River Real Estate",
        "asset_id": 6,
        "asset_type": "Real Estate",
        "isin": "AU6677889900",
        "currency": "AUD",
        "issuer": "Blue River Developments",
        "issue_date": datetime.datetime.strptime("2019-02-15", "%Y-%m-%d").date(),
        "rating": "AAA",
        "par_value": 3000,
        "sector": "Real Estate",
        "issuing_country": "Australia"
    },
    {
        "asset_name": "Tech Pioneers Bond",
        "asset_id": 7,
        "asset_type": "Bond",
        "isin": "IN1236547890",
        "currency": "INR",
        "issuer": "Tech Pioneers Pvt. Ltd.",
        "issue_date": datetime.datetime.strptime("2020-06-10", "%Y-%m-%d").date(),
        "rating": "AA+",
        "par_value": 10000,
        "sector": "Technology",
        "issuing_country": "India"
    },
    {
        "asset_name": "Renewable Ventures Stock",
        "asset_id": 8,
        "asset_type": "Stock",
        "isin": "US9988776655",
        "currency": "USD",
        "issuer": "Renewable Ventures Inc.",
        "issue_date": datetime.datetime.strptime("2017-08-18", "%Y-%m-%d").date(),
        "rating": "BBB",
        "par_value": 400,
        "sector": "Energy",
        "issuing_country": "United States"
    },
    {
        "asset_name": "Econ Builders Real Estate",
        "asset_id": 9,
        "asset_type": "Real Estate",
        "isin": "ZA4455667788",
        "currency": "ZAR",
        "issuer": "Econ Builders Ltd.",
        "issue_date": datetime.datetime.strptime("2021-12-10", "%Y-%m-%d").date(),
        "rating": "A",
        "par_value": 5000,
        "sector": "Real Estate",
        "issuing_country": "South Africa"
    },
    {
        "asset_name": "FinTech Innovation Stock",
        "asset_id": 10,
        "asset_type": "Stock",
        "isin": "HK1123581321",
        "currency": "HKD",
        "issuer": "FinTech Innovation Ltd.",
        "issue_date": datetime.datetime.strptime("2019-05-14", "%Y-%m-%d").date(),
        "rating": "AA",
        "par_value": 350,
        "sector": "Finance",
        "issuing_country": "Hong Kong"
    },
        {
        "asset_name": "Global Telecom Bond",
        "asset_id": 11,
        "asset_type": "Bond",
        "isin": "SG9876543210",
        "currency": "SGD",
        "issuer": "Global Telecom Pte Ltd.",
        "issue_date": datetime.datetime.strptime("2023-01-15", "%Y-%m-%d").date(),
        "rating": "AA-",
        "par_value": 1500,
        "sector": "Telecommunications",
        "issuing_country": "Singapore"
    },
    {
        "asset_name": "AgriGrowth Stock",
        "asset_id": 12,
        "asset_type": "Stock",
        "isin": "BR1234567890",
        "currency": "BRL",
        "issuer": "AgriGrowth Corp.",
        "issue_date": datetime.datetime.strptime("2016-04-10", "%Y-%m-%d").date(),
        "rating": "A-",
        "par_value": 250,
        "sector": "Agriculture",
        "issuing_country": "Brazil"
    },
    {
        "asset_name": "Metro Real Estate Trust",
        "asset_id": 13,
        "asset_type": "Real Estate",
        "isin": "FR1122334455",
        "currency": "EUR",
        "issuer": "Metro Developments",
        "issue_date": datetime.datetime.strptime("2020-07-30", "%Y-%m-%d").date(),
        "rating": "AAA",
        "par_value": 4000,
        "sector": "Real Estate",
        "issuing_country": "France"
    },
    {
        "asset_name": "CleanTech Stock",
        "asset_id": 14,
        "asset_type": "Stock",
        "isin": "CH5544332211",
        "currency": "CHF",
        "issuer": "CleanTech Solutions AG",
        "issue_date": datetime.datetime.strptime("2021-06-22", "%Y-%m-%d").date(),
        "rating": "BBB+",
        "par_value": 500,
        "sector": "Technology",
        "issuing_country": "Switzerland"
    },
    {
        "asset_name": "Oceanic Energy Bond",
        "asset_id": 15,
        "asset_type": "Bond",
        "isin": "NZ6677889900",
        "currency": "NZD",
        "issuer": "Oceanic Energy Corp.",
        "issue_date": datetime.datetime.strptime("2022-11-18", "%Y-%m-%d").date(),
        "rating": "A+",
        "par_value": 1800,
        "sector": "Energy",
        "issuing_country": "New Zealand"
    },
    {
        "asset_name": "NextGen Healthcare Stock",
        "asset_id": 16,
        "asset_type": "Stock",
        "isin": "KR9988776655",
        "currency": "KRW",
        "issuer": "NextGen Healthcare Ltd.",
        "issue_date": datetime.datetime.strptime("2019-10-25", "%Y-%m-%d").date(),
        "rating": "AA",
        "par_value": 600,
        "sector": "Healthcare",
        "issuing_country": "South Korea"
    },
    {
        "asset_name": "EcoHomes Real Estate",
        "asset_id": 17,
        "asset_type": "Real Estate",
        "isin": "AE4455667788",
        "currency": "AED",
        "issuer": "EcoHomes Ltd.",
        "issue_date": datetime.datetime.strptime("2021-08-12", "%Y-%m-%d").date(),
        "rating": "AAA",
        "par_value": 3500,
        "sector": "Real Estate",
        "issuing_country": "United Arab Emirates"
    },
    {
        "asset_name": "EduFutures Bond",
        "asset_id": 18,
        "asset_type": "Bond",
        "isin": "IN1234598760",
        "currency": "INR",
        "issuer": "EduFutures Pvt. Ltd.",
        "issue_date": datetime.datetime.strptime("2020-03-05", "%Y-%m-%d").date(),
        "rating": "A",
        "par_value": 8000,
        "sector": "Education",
        "issuing_country": "India"
    },
    {
        "asset_name": "RoboTech Stock",
        "asset_id": 19,
        "asset_type": "Stock",
        "isin": "CN5544332234",
        "currency": "CNY",
        "issuer": "RoboTech Ltd.",
        "issue_date": datetime.datetime.strptime("2020-01-10", "%Y-%m-%d").date(),
        "rating": "AA",
        "par_value": 900,
        "sector": "Technology",
        "issuing_country": "China"
    },
    {
        "asset_name": "GreenFields Real Estate",
        "asset_id": 20,
        "asset_type": "Real Estate",
        "isin": "ZA9988776677",
        "currency": "ZAR",
        "issuer": "GreenFields Developments",
        "issue_date": datetime.datetime.strptime("2023-02-01", "%Y-%m-%d").date(),
        "rating": "AAA",
        "par_value": 5000,
        "sector": "Real Estate",
        "issuing_country": "South Africa"
    }
]

rule_descriptions = {
        "bond": [
            ("Late maturity reporting", "The bond issuer failed to report maturity details on time."),
            ("Yield below threshold", "The bond yield dropped below the acceptable threshold."),
            ("Credit rating downgrade", "The bond's credit rating was downgraded unexpectedly.")
        ],
        "stock": [
            ("Exceeded trading limits", "Stock trades exceeded the permitted daily limit."),
            ("Delayed reporting", "The company delayed mandatory reporting for this stock."),
            ("Insider trading suspicion", "Suspicious insider trading activity was flagged.")
        ],
        "real estate": [
            ("Zoning violation", "The property was found to be in violation of local zoning laws."),
            ("Unpaid property taxes", "Taxes on this property remain unpaid for the current year."),
            ("Failed inspection", "The property failed to pass the safety inspection.")
        ]
    }

# List of sample brokers and custodians
company_names = [
    "Morgan Stanley", "Goldman Sachs", "JP Morgan", "BlackRock",
    "Vanguard", "State Street", "Fidelity", "Charles Schwab",
    "Wells Fargo", "UBS", "Credit Suisse", "Deutsche Bank",
    "Barclays", "HSBC", "Citigroup", "Bank of America",
    "BNP Paribas", "Nomura", "Societe Generale", "Raymond James"
    ]

# List of possible credit ratings
ratings = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC"]

# List of countries for the companies
countries = [
    "USA", "UK", "Switzerland", "Germany", "France", "Japan",
    "Australia", "Canada", "India", "Singapore"
]

# Types of counterparties
types = ["Broker", "Custodian"]
