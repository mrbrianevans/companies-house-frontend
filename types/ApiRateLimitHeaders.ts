// rate limiting info from companies house
export interface RateLimitHeaders {
  limit: number
  remain: number
  // number of seconds since epoch when the rate limit will reset
  reset: number
  window: string
}
