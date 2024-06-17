Feature: Create Order
  As a user
  I want to create a new order
  So that the order can be added to the system

  Scenario: Successfully create a new order
    Given I have a valid order data
    When I send a POST request to "/order" with the order data
    Then I should receive a 201 status code and the order number
