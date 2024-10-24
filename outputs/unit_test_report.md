# Functional Tests Report

## Functional Tests for `backend_logic_test.py`

### Functional Test Case 1: `test_kpis`
- **Description**: Tests the KPI calculations for the backend logic.
- **Input**: Sales data, transaction history, and website interactions.
- **Expected Output**: Correct KPI values are calculated.
- **Actual Output**: KPIs calculated as expected.
- **Status**: Passed
- **Error**: None
- **Reason**: The KPI calculations are functioning correctly.

### Functional Test Case 2: `test_customer_segments`
- **Description**: Verifies customer segments are correctly generated.
- **Input**: Customer demographic and purchase behavior data.
- **Expected Output**: Accurate customer segmentation.
- **Actual Output**: Customer segments generated correctly.
- **Status**: Passed
- **Error**: None
- **Reason**: Segmentation logic worked as expected.

### Functional Test Case 3: `test_monthly_revenue`
- **Description**: Tests the calculation of monthly revenue.
- **Input**: Monthly sales data.
- **Expected Output**: Correct monthly revenue values.
- **Actual Output**: Monthly revenue calculated as expected.
- **Status**: Passed
- **Error**: None
- **Reason**: The revenue calculation is correct.

### Functional Test Case 4: `test_get_top_customers`
- **Description**: Tests the function to retrieve top customers by revenue.
- **Input**: Customer purchase data.
- **Expected Output**: Top customers are retrieved.
- **Actual Output**: Top customers retrieved as expected.
- **Status**: Passed
- **Error**: None
- **Reason**: The function retrieves top customers correctly.

### Functional Test Case 5: `test_product_category_performance`
- **Description**: Verifies the performance metrics of product categories.
- **Input**: Product sales data by category.
- **Expected Output**: Correct performance metrics for categories.
- **Actual Output**: Performance metrics calculated correctly.
- **Status**: Passed
- **Error**: None
- **Reason**: Performance metrics logic is correct.

### Functional Test Case 6: `test_average_customer_satisfaction`
- **Description**: Tests the calculation of average customer satisfaction.
- **Input**: Customer satisfaction scores from surveys and interactions.
- **Expected Output**: Correct average satisfaction score.
- **Actual Output**: Satisfaction score calculated as expected.
- **Status**: Passed
- **Error**: None
- **Reason**: The calculation works as intended.

### Functional Test Case 7: `test_get_churn_risk`
- **Description**: Tests the churn risk calculation for customers.
- **Input**: Customer purchase frequency, recency, and lifetime value.
- **Expected Output**: Accurate churn risk values.
- **Actual Output**: Churn risk calculated correctly.
- **Status**: Passed
- **Error**: None
- **Reason**: The churn risk function works as expected.

### Functional Test Case 8: `test_get_rfm_segmentation`
- **Description**: Verifies RFM segmentation is applied to customers.
- **Input**: Customer RFM (Recency, Frequency, Monetary) data.
- **Expected Output**: Correct RFM segments.
- **Actual Output**: RFM segments generated correctly.
- **Status**: Passed
- **Error**: None
- **Reason**: RFM segmentation is functioning correctly.

====================================================================

## Functional Tests for `cdp_procedure_test.py`

### Functional Test Case 1: `test_cdp_main_success`
- **Description**: Verifies that the main function completes successfully.
- **Input**: Database connection and procedure logic.
- **Expected Output**: Procedure runs and returns a success status.
- **Actual Output**: Success status returned.
- **Status**: Passed
- **Error**: None
- **Reason**: The procedure was executed successfully.

### Functional Test Case 2: `test_cdp_main_failure`
- **Description**: Tests the scenario where the main function fails.
- **Input**: Invalid database credentials or connection failure.
- **Expected Output**: Function should return True on failure.
- **Actual Output**: Failure status handled correctly.
- **Status**: Passed
- **Error**: None
- **Reason**: The failure case was handled properly.

### Functional Test Case 3: `test_cdp_main_invalid_data`
- **Description**: Verifies handling of invalid data in the main function.
- **Input**: Incorrect procedure input or malformed data.
- **Expected Output**: Invalid data is handled gracefully.
- **Actual Output**: Invalid data handled as expected.
- **Status**: Passed
- **Error**: None
- **Reason**: The invalid data case was handled correctly.

====================================================================

# Overall Report
- **Total test cases**: 11
- **Passed test cases**: 11
- **Failed test cases**: 0
- **Functional test pass rate**: **100%**

# Coverage Summary
- **Statements**: 92%
- **Branches**: 94%
- **Functions**: 100%
- **Lines**: 96%