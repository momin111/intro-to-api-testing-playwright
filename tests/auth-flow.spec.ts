import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath  = 'orders'

test('Login with incorrect credentials and get auth code 401', async ({ request }) => {
  // Build and send a GET request to the server
  const loginDto = LoginDto.createLoginWithIncorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Login with Correct credentials and return code 200', async ({ request }) => {
  // Build and send a GET request to the server
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
})

test('Successful authorization and create order', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  const jwt = await  response.text() //define jwt
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
  const orderDto = OrderDto.createOrderWithRandomData()
  orderDto.id = undefined
  const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
    data: orderDto,
    headers:{
      Authorization: `Bearer ${jwt}`, //use jwt
    }
  })
  const orderResponseJSON = await orderResponse.json()
  console.log(orderResponseJSON)
  expect.soft(orderResponseJSON.status).toBe("OPEN")
  expect.soft(orderResponseJSON.id).toBeDefined()

})