const { Given, When, Then } = require('@cucumber/cucumber');
const { CreateOrderController } = require('../../dist/adapters/controllers/create-order/create-order.controller');
const chai = require('chai');
const expect = chai.expect;

let controller;
let response;
let requestData;

class CreateOrderUseCaseMock {
  async execute(data) {
    return 'mock-order-number';
  }
}

Given('I have a valid order data', function () {
  requestData = {
    product: 'Test Product',
    quantity: 10,
  };
  controller = new CreateOrderController(new CreateOrderUseCaseMock());
});

When('I send a POST request to {string} with the order data', async function (path) {
  const httpRequest = {
    body: requestData,
    path,
    method: 'POST',
  };
  response = await controller.execute(httpRequest);
});

Then('I should receive a {int} status code and the order number', function (statusCode) {
  expect(response.statusCode).to.equal(statusCode);
  expect(response.body.orderNumber).to.equal('mock-order-number');
});
