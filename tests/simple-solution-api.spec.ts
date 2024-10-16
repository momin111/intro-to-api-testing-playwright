import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

test('Get order: with correct id should receive code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/3')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  // Check if the response status is 200
  expect(response.status()).toBe(StatusCodes.OK)
})

test('Get order: with incorrect id should receive code 400', async ({ request }) => {
  // Build and send a GET request to the server
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0')
  // Log the response status, body and headers
  console.log('response body:', await response.json())
  console.log('response headers:', response.headers())
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Create order: with correct data should receive code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Create new order',
    id: 3,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})

test('Create order: with closed status data should receive bad request', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'CLOSE',
    courierId: 4,
    customerName: 'Ema Wattson',
    customerPhone: '+37255696698',
    comment: 'Create new order',
    id: 4,
  }
  // Send a POST request to the server
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  //console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Update order: with correct data should receive status code 200', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  // Send a PUT request to the server
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  console.log('response body:', await response.json())
  expect(response.status()).toBe(StatusCodes.OK)
})

test('Update order: with closed status should receive status BadRequest', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'CLOSED',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  // Send a PUT request to the server
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Update order: with wrong api key should receive status BadRequest', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  // Send a PUT request to the server
  const requestHeader = {
    api_key: '123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('Update order: with empty api key should receive status BadRequest', async ({ request }) => {
  // prepare request body
  const requestBody = {
    status: 'OPEN',
    courierId: 3,
    customerName: 'Jhon Lockey',
    customerPhone: '+37255855545',
    comment: 'Update old orders',
    id: 3,
  }
  // Send a PUT request to the server
  const requestHeader = {
    api_key: ' ',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/2', {
    data: requestBody,
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('Delete order: with correct data should receive code 204', async ({ request }) => {
  // Send a DEL request to the server
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/2', {
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(204)
})
test('Delete order: with zero order id should receive status BarRequest', async ({ request }) => {
  // Send a DEL request to the server
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/0', {
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
test('Delete order: with wrong api key should receive status Unauthorized', async ({ request }) => {
  // Send a DEL request to the server
  const requestHeader = {
    api_key: '1234567',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/2', {
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Delete order: with empty api key should receive status Unauthorized', async ({ request }) => {
  // Send a DEL request to the server
  const requestHeader = {
    api_key: ' ',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/2', {
    headers: requestHeader,
  })
  // Log the response status and body
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
