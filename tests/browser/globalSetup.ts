const path = require('path')
const cli = require('next/dist/cli/next-build')

export default async function globalSetup() {
  process.env.PLAYWRIGHT = '1'
  process.env.PLAYWRIGHT_JSON_OUTPUT_NAME = 'screenshots/testResults.json'
  // console.log('Skip build?', Number(process.env.SKIP_BUILD) === 1, `${Number(process.env.SKIP_BUILD)} === 1`)
  if (Number(process.env.SKIP_BUILD) === 1) {
    console.log('skipping build as SKIP_BUILD is set')
  } else {
    await cli.nextBuild([path.join(__dirname, '../..')])
  }
}
