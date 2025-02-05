import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'

test('Login with Correct credentials and return code 200', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect.soft(response.status()).toBe(StatusCodes.OK)
  console.log(await response.text())
})
test('With correct request verify response contain a valid JWT token', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  const responseBody = await response.text()
  const jwtStructure = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody).toMatch(jwtStructure)
})
test('Login with incorrect credentials and get auth code 401', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithIncorrectCredentials()
  const response = await request.post(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  console.log('response status:', response.status())
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})
test('Incorrect HTTP method returns 405 status code', async ({ request }) => {
  const loginDto = LoginDto.createLoginWithCorrectCredentials()
  const response = await request.delete(`${serviceURL}${loginPath}`, {
    data: loginDto,
  })
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  expect.soft(responseBody.status).toBe(405)
  expect.soft(responseBody.error).toBe('Method Not Allowed')
})
