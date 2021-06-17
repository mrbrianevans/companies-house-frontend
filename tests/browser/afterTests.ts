import { Storage } from '@google-cloud/storage'
const fs = require('fs')
const { execSync } = require('child_process')

/**
 * global tear down runs after all tests have completed.
 *
 * Upload all screenshots to google cloud and the results.json to postgres
 */
export default async function globalTeardown() {
  if (process.env.SKIP_BROWSER_TESTS_TEARDOWN) return
  const private_key = Buffer.from(process.env.GOOGLE_STORAGE_PRIVATE_KEY, 'base64').toString('utf8')
  const client_email = Buffer.from(process.env.GOOGLE_STORAGE_EMAIL, 'base64').toString('utf8')
  const client = new Storage({
    // this authenticates the travis runner using environment variables
    projectId: 'companies-house-data',
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
    credentials: {
      client_email,
      private_key
    }
  })
  const bucket = await client.bucket('filter-facility-screenshots')
  const tempOutputDir = process.env.BROWSER_TEST_OUTPUT_DIR
  if (!tempOutputDir) throw new Error('Could not find temporary output directory: ' + tempOutputDir)
  const outputFiles = fs.readdirSync(tempOutputDir)
  let gitCommitHash: string
  try {
    gitCommitHash = execSync('git log -n 1 --pretty=format:"%h"').toString('utf8')
    console.log('Latest git commit: ', gitCommitHash)
  } catch (e) {
    console.error('Could not find latest git commit hash, using timestamp instead')
    gitCommitHash = Date.now().toString().slice(-7)
  }
  console.time('Uploaded file to Storage()')
  for (const outputFile of outputFiles) {
    if (!fs.existsSync(`${tempOutputDir}/${outputFile}`)) {
      console.warn('Cant find file to upload:', `${tempOutputDir}/${outputFile}`)
      continue
    }
    if (fs.lstatSync(`${tempOutputDir}/${outputFile}`).isDirectory()) {
      console.warn('Cannot nest directories in output folder! Skipping ', `${tempOutputDir}/${outputFile}`)
      continue
    }
    // only uploads if file exists and is not a directory
    const res = await bucket.upload(`${tempOutputDir}/${outputFile}`, {
      destination: `${gitCommitHash}/${outputFile}`
    })
    // console.debug(`Uploaded ${res[1].name} at ${res[1].updated}`)
    console.timeLog('Uploaded file to Storage()', res[1].name)
    fs.rmSync(`${tempOutputDir}/${outputFile}`)
    //deletes file and directory afterwards
  }
  console.timeEnd('Uploaded file to Storage() in')
  fs.rmdirSync(tempOutputDir)
}
