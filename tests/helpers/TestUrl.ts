export class TestUrl {
  private readonly baseUrl: string
  constructor({ port, url }: { port?: string | number; url?: string }) {
    if (url !== undefined) this.baseUrl = url
    else if (port !== undefined) this.baseUrl = `http://localhost:${port}`
    else throw new Error('Either URL or Port must be defined. Both were undefined')

    // make sure baseUrl ends with a trailing slash
    if (this.baseUrl.split('').slice(-1)[0] !== '/') this.baseUrl += '/'
    // make sure its set
    console.assert(
      this.baseUrl.split('').slice(-1)[0] === '/',
      `URL doesn't end with trailing slash: last char: ` + this.baseUrl.split('').slice(-1)[0]
    )
  }

  public getUrl(...path: string[]) {
    // console.debug('TestUrl class debug:', 'getUrl called. Returning:', this.baseUrl + path?.join('/'))
    return this.baseUrl + path?.join('/')
  }
}
