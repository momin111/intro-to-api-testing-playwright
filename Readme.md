# Checklist for test-order-controller

| NO | Test Case                                                           | Status |
|----|---------------------------------------------------------------------|--------|
| 1  | Get order: with correct id should receive code 200                  | PASS   |
| 2  | Get order: with incorrect id should receive code 400                | PASS   |
| 3  | Create order: with correct data should receive code 200             | PASS   |
| 4  | Create order: with closed status data should receive bad request    | PASS   |
| 5  | Update order: with correct data should receive status code 200      | PASS   |
| 6  | Update order: with closed status should receive status BadRequest   | PASS   |
| 7  | Update order: with wrong api key should receive status BadRequest   | PASS   |
| 8  | Update order: with empty api key should receive status BadRequest   | PASS   |
| 9  | Delete order: with correct data should receive code 204             | PASS   |
| 10 | Delete order: with zero order id should receive status BarRequest   | PASS   |
| 11 | Delete order: with wrong api key should receive status Unauthorized | PASS   |
| 12 | Delete order: with empty api key should receive status Unauthorized | PASS   |
