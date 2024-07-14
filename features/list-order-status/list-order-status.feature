Feature: List Order Status
  As a user
  I want to list the status of an order
  So that I can track the progress of the order

  Scenario: Successfully list the status of an order
    Given I have a valid order number
    When I send a GET request to "/order/status" with the order number
    Then I should receive a 200 status code and the list order
