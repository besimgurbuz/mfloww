import { NextRequest, NextResponse } from "next/server"

import {
  ExchangeRate,
  SUPPORTED_CURRENCY_CODES,
  SupportedCurrencyCode,
} from "@/lib/definitions"
import { adminAuth } from "@/lib/server/admin"
import {
  CurrencyApiClient,
  CurrencyLayerClient,
  ExchangeRateClient,
  FixerClient,
} from "@/lib/server/exchange-rates"

const exchangeRates = () => {
  const clients = [
    new CurrencyApiClient(),
    new CurrencyLayerClient(),
    new ExchangeRateClient(),
    new FixerClient(),
  ] as const
  let currentClient = 0
  const cache: Partial<Record<SupportedCurrencyCode, ExchangeRate>> = {}
  const lastFetchMap: Partial<Record<SupportedCurrencyCode, Date>> = {}

  async function fetchLatestRates(
    baseCurrency: SupportedCurrencyCode
  ): Promise<ExchangeRate> {
    try {
      const exchangeRates =
        await clients[currentClient].getExchangeRates(baseCurrency)
      delete exchangeRates.rates[baseCurrency]
      return exchangeRates as ExchangeRate
    } catch (error) {
      if (currentClient < clients.length - 1) {
        currentClient++
        return await fetchLatestRates(baseCurrency)
      }
      throw error
    }
  }

  function shouldRefresh(baseCurrency: SupportedCurrencyCode) {
    if (!lastFetchMap[baseCurrency]) {
      return true
    }
    return (
      Date.now() - (lastFetchMap[baseCurrency] as Date).getTime() >
      1000 * 60 * 60 * 2
    )
  }

  return async (baseCurrency: SupportedCurrencyCode): Promise<ExchangeRate> => {
    if (cache[baseCurrency] && !shouldRefresh(baseCurrency)) {
      return cache[baseCurrency] as ExchangeRate
    }

    const exchangeRate = await fetchLatestRates(baseCurrency)
    cache[baseCurrency] = exchangeRate
    lastFetchMap[baseCurrency] = new Date()

    return exchangeRate
  }
}

const getExchangeRates = exchangeRates()

export const GET = async (req: NextRequest) => {
  const sessionCookie = req.cookies.get("__session")

  if (!sessionCookie) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const decodedToken = await adminAuth.verifySessionCookie(sessionCookie.value)

  if (!decodedToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    )
  }

  const baseCurrency = req.nextUrl.searchParams.get("base")

  if (
    !baseCurrency ||
    !SUPPORTED_CURRENCY_CODES.includes(baseCurrency as SupportedCurrencyCode)
  ) {
    return NextResponse.json(
      {
        message: "Invalid base currency",
      },
      {
        status: 400,
      }
    )
  }

  const exchangeRate = await getExchangeRates(
    baseCurrency as SupportedCurrencyCode
  )

  return NextResponse.json(exchangeRate, {
    status: 200,
  })
}
