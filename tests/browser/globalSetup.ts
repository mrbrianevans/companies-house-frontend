const path = require('path')
const cli = require('next/dist/cli/next-build')
import * as fs from 'fs'

export default async function globalSetup() {
  process.env.PLAYWRIGHT = '1'
  // creates a temporary directory prefixed with output to save screenshots and JSON before they get persisted
  process.env.BROWSER_TEST_OUTPUT_DIR = fs.mkdtempSync('tests/browser/output')
  process.env.PLAYWRIGHT_JSON_OUTPUT_NAME = `${process.env.BROWSER_TEST_OUTPUT_DIR}/testResults.json`
  if (Number(process.env.SKIP_BUILD) === 1) {
    console.log('Skipping build as SKIP_BUILD is set')
  } else {
    await cli.nextBuild([path.join(__dirname, '../..')])
  }
}
