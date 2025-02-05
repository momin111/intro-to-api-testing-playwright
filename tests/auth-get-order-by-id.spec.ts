import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'
import { ApiClient } from './api/api-client'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

test('Without API client: Create order by authorization and get the order by id', async ({
  request,
}) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  const jwt = await response.text() //define jwt
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
  const orderDto = OrderDto.createOrderWithRandomData()
  orderDto.customerName = 'Momin Reja'
  orderDto.customerPhone = '+37255845856'
  orderDto.id = undefined
  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: orderDto,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  const orderResponseJSON = await orderResponse.json()
  console.log(orderResponseJSON)
  expect.soft(orderResponseJSON.status).toBe('OPEN')
  expect.soft(orderResponseJSON.id).toBeDefined()
  const getOrderResponse = await request.get(`${serviceURL}${orderPath}/${orderResponseJSON.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })
  const getOrderResponseJSON = await getOrderResponse.json()
  console.log(getOrderResponseJSON)
  expect.soft(getOrderResponseJSON.status).toBe('OPEN')
  expect.soft(getOrderResponseJSON.customerName).toBe('Momin Reja')
  expect.soft(getOrderResponseJSON.id).toBe(orderResponseJSON.id)
})
test('Without API client: Create order by authorization and delete the order by id', async ({
  request,
}) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  const jwt = await response.text() //define jwt
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
  const orderDto = OrderDto.createOrderWithRandomData()
  orderDto.customerName = 'Jhon william'
  orderDto.customerPhone = '+37255845445'
  orderDto.id = undefined
  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: orderDto,
    headers: {
      Authorization: `Bearer ${jwt}`, //use jwt
    },
  })
  const orderResponseJSON = await orderResponse.json()
  console.log(orderResponseJSON)
  expect.soft(orderResponseJSON.status).toBe('OPEN')
  expect.soft(orderResponseJSON.id).toBeDefined()

  //get order by id
  const getOrderResponse = await request.get(`${serviceURL}${orderPath}/${orderResponseJSON.id}`, {
    headers: {
      Authorization: `Bearer ${jwt}`, //use jwt
    },
  })
  const getOrderResponseJSON = await getOrderResponse.json()
  console.log(getOrderResponseJSON)
  expect.soft(getOrderResponseJSON.status).toBe('OPEN')
  expect.soft(getOrderResponseJSON.customerName).toBe('Jhon william')
  expect.soft(getOrderResponseJSON.id).toBe(orderResponseJSON.id)

  const deleteOrderResponse = await request.delete(
    `${serviceURL}${orderPath}/${orderResponseJSON.id}`,
    {
      headers: { Authorization: `Bearer ${jwt}` },
    },
  )
  expect(deleteOrderResponse.status()).toBe(StatusCodes.OK)
})
test('With API client: Authorize and Get Order ID using api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  expect.soft(orderId).toBeDefined()
  await apiClient.getOrderId(orderId)
  expect.soft(orderId).toBeDefined()
})
test('With API client: Authorize and Delete Order ID using api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  expect.soft(orderId).toBeDefined()
  await apiClient.deleteOrderId(orderId)
  expect.soft(orderId).toBeDefined()
})
