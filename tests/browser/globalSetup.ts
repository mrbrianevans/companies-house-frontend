const path = require('path')
const cli = require('next/dist/cli/next-build')

export default async function globalSetup() {
  process.env.PLAYWRIGHT = '1'
  if (process.env.SKIP_BUILD === '1') {
    console.log('skipping build as SKIP_BUILD is set')
  } else {
    await cli.nextBuild([path.join(__dirname, '../..')])
  }
}
