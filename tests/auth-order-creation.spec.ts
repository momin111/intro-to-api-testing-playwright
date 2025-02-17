import { expect, test } from '@playwright/test'
import { ApiClient } from './api/api-client'

test('Successful authorization and order creation', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request) //already authorized
  const orderId = await apiClient.createOrderAndReturnOrderId()
  expect.soft(orderId).toBeDefined()
  console.log(orderId)
})
