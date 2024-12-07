# CDP Schema Creation Process

## Step 1: Analyze Source Tables

Based on the provided DDL scripts, we have the following source tables:
1. customer_info
2. product_catalog
3. purchase_transactions
4. customer_service
5. marketing_campaigns
6. campaign_responses
7. website_behavior

## Step 2: Create Temporary Tables

### 2.1 temp_customer_basic
Purpose: Store basic customer information
```sql
CREATE TEMPORARY TABLE temp_customer_basic AS
SELECT 
    customer_id,
    first_name,
    last_name,
    email,
    phone_number,
    date_of_birth,
    registration_date
FROM customer_info;
```

### 2.2 temp_purchase_stats
Purpose: Calculate purchase-related statistics
```sql
CREATE TEMPORARY TABLE temp_purchase_stats AS
SELECT 
    customer_id,
    COUNT(DISTINCT transaction_id) AS total_orders,
    SUM(total_amount) AS total_lifetime_value,
    MAX(purchase_date) AS last_purchase_date,
    AVG(total_amount) AS average_order_value
FROM purchase_transactions
GROUP BY customer_id;
```

### 2.3 temp_product_preferences
Purpose: Determine favorite product category and brand
```sql
CREATE TEMPORARY TABLE temp_product_preferences AS
SELECT 
    pt.customer_id,
    pc.category AS favorite_category,
    pc.brand AS favorite_brand
FROM purchase_transactions pt
JOIN product_catalog pc ON pt.product_id = pc.product_id
GROUP BY pt.customer_id, pc.category, pc.brand
HAVING COUNT(*) = (
    SELECT COUNT(*) 
    FROM purchase_transactions pt2
    JOIN product_catalog pc2 ON pt2.product_id = pc2.product_id
    WHERE pt2.customer_id = pt.customer_id
    GROUP BY pc2.category, pc2.brand
    ORDER BY COUNT(*) DESC
    LIMIT 1
);
```

### 2.4 temp_customer_service_stats
Purpose: Aggregate customer service interactions
```sql
CREATE TEMPORARY TABLE temp_customer_service_stats AS
SELECT 
    customer_id,
    COUNT(*) AS total_interactions,
    AVG(satisfaction_score) AS avg_satisfaction_score,
    SUM(CASE WHEN resolution_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_interactions
FROM customer_service
GROUP BY customer_id;
```

### 2.5 temp_campaign_engagement
Purpose: Measure customer engagement with marketing campaigns
```sql
CREATE TEMPORARY TABLE temp_campaign_engagement AS
SELECT 
    cr.customer_id,
    COUNT(DISTINCT cr.campaign_id) AS campaigns_engaged,
    SUM(CASE WHEN cr.response_type = 'Conversion' THEN 1 ELSE 0 END) AS campaign_conversions
FROM campaign_responses cr
JOIN marketing_campaigns mc ON cr.campaign_id = mc.campaign_id
GROUP BY cr.customer_id;
```

### 2.6 temp_website_behavior
Purpose: Analyze customer website behavior
```sql
CREATE TEMPORARY TABLE temp_website_behavior AS
SELECT 
    customer_id,
    COUNT(*) AS total_visits,
    AVG(pages_viewed) AS avg_pages_per_visit,
    AVG(time_spent) AS avg_time_spent,
    MAX(visit_date) AS last_visit_date
FROM website_behavior
GROUP BY customer_id;
```

## Step 3: Create the Customer 360 Table

Now, we'll join all the temporary tables to create the final customer_360 table:

```sql
CREATE TABLE customer_360 AS
SELECT
    tcb.*,
    tps.total_orders,
    tps.total_lifetime_value,
    tps.last_purchase_date,
    tps.average_order_value,
    tpp.favorite_category,
    tpp.favorite_brand,
    tcss.total_interactions,
    tcss.avg_satisfaction_score,
    tcss.resolved_interactions,
    tce.campaigns_engaged,
    tce.campaign_conversions,
    twb.total_visits,
    twb.avg_pages_per_visit,
    twb.avg_time_spent,
    twb.last_visit_date,
    -- Derived fields
    CASE
        WHEN tps.total_lifetime_value > 1000 THEN 'High Value'
        WHEN tps.total_lifetime_value > 500 THEN 'Medium Value'
        ELSE 'Low Value'
    END AS customer_segment,
    DATEDIFF(CURRENT_DATE, tps.last_purchase_date) AS days_since_last_purchase,
    DATEDIFF(CURRENT_DATE, twb.last_visit_date) AS days_since_last_visit,
    (tcss.resolved_interactions * 1.0 / NULLIF(tcss.total_interactions, 0)) AS service_resolution_rate,
    (tce.campaign_conversions * 1.0 / NULLIF(tce.campaigns_engaged, 0)) AS campaign_conversion_rate,
    CASE
        WHEN DATEDIFF(CURRENT_DATE, tps.last_purchase_date) > 365 THEN 'High'
        WHEN DATEDIFF(CURRENT_DATE, tps.last_purchase_date) > 180 THEN 'Medium'
        ELSE 'Low'
    END AS churn_risk
FROM temp_customer_basic tcb
LEFT JOIN temp_purchase_stats tps ON tcb.customer_id = tps.customer_id
LEFT JOIN temp_product_preferences tpp ON tcb.customer_id = tpp.customer_id
LEFT JOIN temp_customer_service_stats tcss ON tcb.customer_id = tcss.customer_id
LEFT JOIN temp_campaign_engagement tce ON tcb.customer_id = tce.customer_id
LEFT JOIN temp_website_behavior twb ON tcb.customer_id = twb.customer_id;
```

## Step 4: Final Customer 360 Table Schema

Here's the final customer_360 table schema in JSON format:

```json
{
  "customer_360": {
    "customer_id": "INTEGER",
    "first_name": "TEXT",
    "last_name": "TEXT",
    "email": "TEXT",
    "phone_number": "TEXT",
    "date_of_birth": "DATE",
    "registration_date": "DATE",
    "total_orders": "INTEGER",
    "total_lifetime_value": "REAL",
    "last_purchase_date": "DATE",
    "average_order_value": "REAL",
    "favorite_category": "TEXT",
    "favorite_brand": "TEXT",
    "total_interactions": "INTEGER",
    "avg_satisfaction_score": "REAL",
    "resolved_interactions": "INTEGER",
    "campaigns_engaged": "INTEGER",
    "campaign_conversions": "INTEGER",
    "total_visits": "INTEGER",
    "avg_pages_per_visit": "REAL",
    "avg_time_spent": "INTEGER",
    "last_visit_date": "DATE",
    "customer_segment": "TEXT",
    "days_since_last_purchase": "INTEGER",
    "days_since_last_visit": "INTEGER",
    "service_resolution_rate": "REAL",
    "campaign_conversion_rate": "REAL",
    "churn_risk": "TEXT"
  }
}
```

## Explanations for Derived Fields

1. **customer_segment**: Categorizes customers based on their total lifetime value.
2. **days_since_last_purchase**: Calculates the number of days since the customer's last purchase.
3. **days_since_last_visit**: Calculates the number of days since the customer's last website visit.
4. **service_resolution_rate**: Ratio of resolved interactions to total interactions.
5. **campaign_conversion_rate**: Ratio of campaign conversions to campaigns engaged.
6. **churn_risk**: Assesses the risk of customer churn based on the time since their last purchase.

## Incorporating Developer Insights

Based on the developer conversations, we've incorporated the following aspects into our CDP schema:

1. **Data Integration**: We've combined data from various sources (customer info, purchases, service interactions, marketing campaigns, and website behavior) into a single customer view.

2. **Customer Profiling**: We've included fields for customer segmentation (customer_segment) and predictive analytics (churn_risk).

3. **Real-time Data Processing**: While not directly implemented in the schema, the structure allows for real-time updates to customer profiles as new data comes in.

4. **Advanced Analytics and Segmentation**: The schema includes derived fields that enable complex analysis and segmentation.

5. **Personalization**: Fields like favorite_category and favorite_brand can be used for personalized recommendations.

6. **Data Governance and Security**: While not directly reflected in the schema, it's crucial to implement proper access controls and encryption for sensitive data fields.

7. **Scalability**: The schema is designed to handle various aspects of customer data, allowing for future expansion as the CDP evolves.

This CDP schema provides a comprehensive view of customer data, enabling effective data visualization, user accessibility, and interactivity for the CDP dashboard interface. It balances modularity and scalability, allowing for future enhancements as the CDP handles more complex data flows.