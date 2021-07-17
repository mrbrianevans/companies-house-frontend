import test from '../nextFixture'
import { expect } from '@playwright/test'
import { TestUrl } from '../../helpers/TestUrl'

test('home page logo test', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl())
  const logo = await page.innerText('h1')
  expect(logo).toBe('Filter Facility')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/homepage.png` })
})

test('home page after 5 seconds', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl())
  await new Promise((res) => setTimeout(res, 5000))
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/homepageAfter5secondsFull.png`,
    fullPage: true
  })
})

/**
 * navigates to all the links on the homepage to capture screenshots and make sure they resolve to status 200
 */
test('home page hyper links', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  let response = await page.goto(testUrl.getUrl())
  expect(response.status()).toBe(200)

  await page.click('button:has-text("Search")')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Search.png` })
  await page.goBack()

  await page.click('a:has-text("Filter accountants")')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Filter accountants.png` })
  await page.goBack()

  await page.click('a:has-text("Filter companies")')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Filter companies.png` })
  await page.goBack()

  await page.click('a:has-text("Search companies")')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Search companies.png` })
  await page.goBack()

  await page.click('a:has-text("Search accountants")')
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Search accountants.png` })
  /*
  I would like to test the response codes of the hyper links, but can't find a way to do it. Tried this:

  let [response] = await Promise.all([page.waitForNavigation(), page.click('a:has-text("Search accountants")')])
  expect(response.status()).toBe(200)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/HomepageLink-Search accountants.png` })

  but doesn't work because waitForNavigation returns null if the navigation was with a hyperlink. ??
   */
})
