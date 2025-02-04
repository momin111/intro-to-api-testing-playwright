import { expect, test } from '@playwright/test'
import { LoanDto } from './dto/loan-dto'
import { StatusCodes } from 'http-status-codes'

test.describe('Verify risk for loan', () => {
  test('Low Risk: when loan period is 12 months', async ({ request }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.loanPeriod = 12
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.riskLevel).toBe('Low Risk')
  })

  test('Medium risk: when loan period is 24 months but risk score is more than 3', async ({
    request,
  }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.loanPeriod = 24
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.riskScore).toBeGreaterThan(3)
    expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  })
  test('Medium risk: when loan period is 12 months but risk score is more than 3', async ({
    request,
  }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.income = 4000
    loanDto.debt = 2000
    loanDto.loanAmount = 2000
    loanDto.loanPeriod = 12
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.riskScore).toBeGreaterThan(3)
    expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  })

  test('Medium risk: when loan period is 12 months', async ({ request }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.loanPeriod = 9
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.OK)
    const responseBody = await response.json()
    expect.soft(responseBody.riskLevel).toBe('Medium Risk')
  })

  test('High risk: when loan period is 3 months', async ({ request }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.loanPeriod = 3
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    const responseBody = await response.json()
    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.riskLevel).toBe('High Risk')
  })
  test('Very high risk: loan decision is negative as risk score is more than 6', async ({
    request,
  }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.income = 1100
    loanDto.loanPeriod = 34
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    const responseBody = await response.json()
    expect.soft(response.status()).toBe(StatusCodes.OK)
    expect.soft(responseBody.riskScore).toBeGreaterThan(6)
    expect.soft(responseBody.riskDecision).toBe('negative')
  })

  test('For negative debt: returns bad request with status code 400', async ({ request }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.debt = -20
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })
  test('For zero income: returns bad request with status code 400', async ({ request }) => {
    const loanDto = LoanDto.calculateRiskScore()
    loanDto.income = 0
    const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: loanDto,
      },
    )
    expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  })
})
