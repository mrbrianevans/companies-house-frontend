import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('test OfficerProfile page loading screen', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // random number needed to avoid hitting the cache
  const officerId = Math.round(Math.random() * 191984630004).toString()
  await page.goto(testUrl.getUrl('officer', officerId.padStart(12, '0')))
  const text = await page.innerText('main')
  expect(text).toMatch(/loading/i)
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerProfile - LoadingScreen.png`
  })
})

test('test OfficerProfile which exists', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const officerId = '091984630004'
  // this waits for the data to be loaded in
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('officer', officerId))
  ])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerProfile - found.png`, fullPage: true })
})

test("test OfficerProfile which doesn't exist", async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const officerId = '0919840004'
  // this waits for the data to be loaded in
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith(officerId + '.json')),
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('officer', officerId))
  ])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerProfile - invalid id.png` })
})
