import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './dto/order-dto'

test('Get order: with correct id should receive status code OK', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/3')
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  expect(response.status()).toBe(StatusCodes.OK)
})
test('Get order: with incorrect id should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Create order: with correct data should receive status code OK', async ({ request }) => {
  const orderDto = OrderDto.createOrderWithRandomData()
  orderDto.customerName = 'Jonathan'
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: orderDto,
  })
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  const responseBody = await response.json()
  expect(response.status()).toBe(StatusCodes.OK)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.status).toBe('OPEN')
  expect.soft(responseBody.customerName).toBe('Jonathan')
})
test('Create order: with closed status data should receive bad request', async ({ request }) => {
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: OrderDto.createOrderWithIncorrectRandomData(),
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Update order: with correct data should receive status status code OK', async ({
  request,
}) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})
test('Update order: with closed status should receive status BadRequest', async ({ request }) => {
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: OrderDto.createOrderWithIncorrectRandomData(),
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Update order: with wrong api key should receive status BadRequest', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  const requestHeader = {
    api_key: '123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Update order: with empty api key should receive status BadRequest', async ({ request }) => {
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  const requestHeader = {
    api_key: ' ',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Delete order: with correct data should receive status code NO_CONTENT', async ({
  request,
}) => {
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/2', {
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})
test('Delete order: with zero order id should receive status BarRequest', async ({ request }) => {
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/0', {
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Delete order: with wrong api key should receive status Unauthorized', async ({ request }) => {
  const requestHeader = {
    api_key: '1234567',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/2', {
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Delete order: with empty api key should receive status Unauthorized', async ({ request }) => {
  const requestHeader = {
    api_key: ' ',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/3', {
    headers: requestHeader,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
