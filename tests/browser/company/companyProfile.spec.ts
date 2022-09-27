import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('test companyProfile page loading screen', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // random number needed to avoid hitting the cache
  const companyNumber = Math.round(Math.random() * 13467944).toString()
  await page.goto(testUrl.getUrl('company', companyNumber))
  const text = await page.innerText('main')
  expect(text).toMatch(/loading/i)
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyProfileLoadingScreen.png`,
    fullPage: true
  })
})

test('test companyProfile page', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const companyNumber = '12851415'
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith(companyNumber + '.json')),
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('company', companyNumber))
  ])
  const companyName = await page.innerText('main h1')
  expect(companyName).toBeDefined()
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyProfile.png` })
})

test('test companyProfile page for company with accounts', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const companyNumber = '03177212'
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith(companyNumber + '.json')),
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('company', companyNumber))
  ])
  const companyName = await page.innerText('main h1')
  expect(companyName).toBeDefined()
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyProfileWithAccounts.png`,
    fullPage: true
  })
})

test('test companyProfile page for company without accounts', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const companyNumber = '13467952'
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith(companyNumber + '.json')),
    page.goto(testUrl.getUrl('company', companyNumber))
  ])
  const companyName = await page.innerText('main h1')
  expect(companyName).toBeDefined()
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyProfileWithoutAccounts.png`,
    fullPage: true
  })
})
