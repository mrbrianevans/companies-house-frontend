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
  const tempOutputDir = process.env.BROWSER_TEST_OUTPUT_DIR
  if (!tempOutputDir) throw new Error('Could not find temporary output directory: ' + tempOutputDir)
  const client = new Storage()
  const bucket = await client.bucket('filter-facility-screenshots')
  const outputFiles = fs.readdirSync(tempOutputDir)
  let gitCommitHash: string
  try {
    gitCommitHash = execSync('git log -n 1 --pretty=format:"%h"').toString('utf8')
    console.log('Latest git commit: ', gitCommitHash)
  } catch (e) {
    console.error('Could not find latest git commit hash, using timestamp instead')
    gitCommitHash = Date.now().toString().slice(-7)
  }
  if (Number(process.env.UPLOAD_TESTS ?? 0) === 1) console.time('Uploaded file to Storage()')
  for (const outputFile of outputFiles) {
    if (!fs.existsSync(`${tempOutputDir}/${outputFile}`)) {
      console.warn('Cant find file to upload:', `${tempOutputDir}/${outputFile}`)
      continue
    }
    if (fs.lstatSync(`${tempOutputDir}/${outputFile}`).isDirectory()) {
      console.warn('Cannot nest directories in output folder! Skipping ', `${tempOutputDir}/${outputFile}`)
      continue
    }
    if (Number(process.env.UPLOAD_TESTS ?? 0) === 1) {
      // only uploads if file exists and is not a directory and env var is set to 1
      const res = await bucket.upload(`${tempOutputDir}/${outputFile}`, {
        destination: `${gitCommitHash}/${outputFile}`
      })
      // console.debug(`Uploaded ${res[1].name} at ${res[1].updated}`)
      console.timeLog('Uploaded file to Storage()', res[1].name)
    }
    fs.rmSync(`${tempOutputDir}/${outputFile}`)
    //deletes file and directory afterwards regardless of if it uploaded to GCS
  }
  if (Number(process.env.UPLOAD_TESTS ?? 0) === 1) console.timeEnd('Uploaded file to Storage() in')
  fs.rmdirSync(tempOutputDir)
}
