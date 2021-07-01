import { createServer, Server } from 'http'
import { parse } from 'url'
import { test as base } from '@playwright/test'
import next from 'next'
import path from 'path'
import { AddressInfo } from 'net'
import Error from 'next/error'
// Extend base test with our fixtures.
const test = base.extend<{
  port: string
}>({
  port: [
    async ({}: any, use: (arg0: string) => any) => {
      const app = next({
        dev: false,
        dir: path.resolve(__dirname, '../..'),
        quiet: true
      })
      await app.prepare()

      const handle = app.getRequestHandler()
      // start next server on arbitrary port
      const server: Server = await new Promise((resolve) => {
        const server = createServer((req, res) => {
          const parsedUrl = parse(req.url, true)
          handle(req, res, parsedUrl)
        })
        server.listen((error: Error) => {
          if (error) throw error
          resolve(server)
        })
      })

      // get the randomly assigned port from the server
      const port = String((server.address() as AddressInfo).port)
      //set the next auth environment variable based on the port
      process.env.NEXTAUTH_URL = 'http://localhost:' + port
      // provide port to tests
      await use(port)
    },
    {
      //@ts-ignore
      scope: 'worker'
    }
  ]
})

// this "test" can be used in multiple test files,
// and each of them will get the fixtures.
export default test
