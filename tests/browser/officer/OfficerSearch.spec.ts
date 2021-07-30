import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'
import exp from 'constants'

test('test OfficerSearch', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('officers', 'search'))
  const title = await page.innerText('main h1')
  // check the page title for something sensible like "Officer search" or "Search officers"
  expect(title).toMatch(/officer/i)
  expect(title).toMatch(/search/i)

  await page.fill('#officerNameSearchBox', 'david smith')

  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/officerSearchWithQueryBeforeClick.png`,
    fullPage: true
  })

  // clicks "search" and waits for the navigation
  await Promise.all([
    page.click('button:text-matches("search", "i")'),
    page.waitForNavigation({ waitUntil: 'networkidle' })
  ])

  const titleAfterSearch = await page.innerText('main h1')
  // check the title reflects that this page should contain results
  expect(titleAfterSearch).toMatch(/results/i)

  // not waiting long enough before taking this screenshot, results haven't loaded in yet
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/officerSearchWithQueryAfterClick.png`,
    fullPage: true
  })
})
