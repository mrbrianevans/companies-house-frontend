import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('company filter page root (no filter applied)', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('company', 'filter'))
  const title = await page.innerText('main h1')
  expect(title).toMatch(/^Filter/)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyFilterRoot.png` })
})

test('company filter page - apply filter from root', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // await page.route('**/api/auth/*', (route) => {
  //   console.log('Intercepted request to Auth API:', route.request().url())
  //   route.fulfill({ status: 500 })
  // })
  await page.route('**/api/chApi/getFilingsList*', (route) => {
    console.log('Intercepted call to companies house for filing items: ', route.request().url())
    route.fulfill({ status: 200, body: JSON.stringify({ items: [], totalCount: 0 }) })
  })
  await page.goto(testUrl.getUrl('company', 'filter'))
  //values to test with
  const testFilterBy = 'location'
  const testOperator = 'includes'
  const testValue = 'exeter'

  // identifies the new filter div by a div containing a h3 that says 'new filter'
  const newFilterDiv = await page.$('div:has(h3:text-matches("new filter", "i"))')
  await newFilterDiv.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/newFilterCompanyDiv.png` })
  const filterBy = await newFilterDiv.$(':nth-match(select, 1)')
  await filterBy.selectOption(testFilterBy)
  const filterOperator = await newFilterDiv.$(':nth-match(select, 2)')
  await filterOperator.selectOption(testOperator)
  const filterValue = await newFilterDiv.$(':nth-match(input, 1)')
  await filterValue.fill(testValue)
  const addFilterButton = await newFilterDiv.$('button:text-matches("add filter", "i")')
  await Promise.all([addFilterButton.click(), page.waitForNavigation()])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/companyFilterApplyNew.png` })

  // check that filter was added and is showing an english representation
  const addedFilterDescription = await page.innerText('div:below(div:has(h3:text-matches("new filter", "i"))) p')
  expect(addedFilterDescription).toMatch(new RegExp(testFilterBy, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp(testOperator, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp(testValue, 'i'))
})
