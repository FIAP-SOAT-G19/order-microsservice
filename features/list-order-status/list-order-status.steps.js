const { Given, When, Then } = require('@cucumber/cucumber');
const { ListOrderStatusController } = require('../../dist/adapters/controllers/list-order-status/list-order-status.controller');
const chai = require('chai');
const expect = chai.expect;

let controller;
let response;
let orderNumber;

class ListOrderStatusUseCaseMock {
  async execute(orderNumber) {
    return { status: 'mock-order-status' };
  }
}

Given('I have a valid order number', function () {
  orderNumber = 'mock-order-number';
  controller = new ListOrderStatusController(new ListOrderStatusUseCaseMock());
});

When('I send a GET request to {string} with the order number', async function (path) {
  const httpRequest = {
    body: { orderNumber },
    path,
    method: 'GET',
  };
  response = await controller.execute(httpRequest);
  response.body = httpRequest.body;
});

Then('I should receive a {int} status code and the list order', function (statusCode) {
  expect(response.statusCode).to.equal(statusCode);
  expect(response.body).to.deep.equal({ orderNumber: 'mock-order-number' });
});

