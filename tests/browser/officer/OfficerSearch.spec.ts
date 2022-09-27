import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('test OfficerSearch', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('officer', 'search'))
  const title = await page.innerText('main h1')
  // check the page title for something sensible like "Officer search" or "Search officers"
  expect(title).toMatch(/officer/i)
  expect(title).toMatch(/search/i)

  await page.fill('#officerSearchBox', 'david smith')

  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerSearch - WithQueryBeforeClick.png`,
    fullPage: true
  })

  // clicks "search" and waits for the navigation
  await Promise.all([
    page.click('button:text-matches("search", "i")'),
    page.waitForNavigation({ waitUntil: 'networkidle' })
  ])

  const titleAfterSearch = await page.innerText('main h1')

  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerSearch - WithQueryAfterClick.png`,
    fullPage: true
  })
  // check the title reflects that this page should contain results
  expect(titleAfterSearch).toMatch(/results/i)
})
