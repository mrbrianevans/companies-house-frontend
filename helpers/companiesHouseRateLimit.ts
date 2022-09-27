import { RateLimitHeaders } from '../types/ApiRateLimitHeaders'

export const getCompaniesHouseRateLimit = (headers: {}) => {
  const values: RateLimitHeaders = { limit: null, remain: null, window: null, reset: null }
  for (const [header, value] of Object.entries(headers)) {
    if (header.startsWith('x-ratelimit-')) {
      const [, label] = header.match(/^x-ratelimit-([a-z-]+)$/)
      if (label === 'limit' || label === 'remain' || label === 'reset') values[label] = Number(value)
      else if (label === 'window') values[label] = String(value)
    }
  }

  return values
}
