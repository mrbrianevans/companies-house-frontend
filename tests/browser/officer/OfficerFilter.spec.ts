import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'
import { FilterComparison } from '../../../configuration/filterComparisons'
import { getFilterComparisonProperties } from '../../../helpers/filters/getFilterComparisonProperties'

test('officer filter page root (no filter applied)', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('officer', 'filter'))
  const title = await page.innerText('main h1')
  expect(title).toMatch(/^Filter/)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerFilter - root page.png` })
})

test('officer filter page - apply filter from root', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // await page.route('**/api/chApi/getFilingsList*', (route) => {
  //   console.log('Intercepted call to companies house for filing items: ', route.request().url())
  //   route.fulfill({ status: 200, body: JSON.stringify({ items: [], totalCount: 0 }) })
  // })
  await page.goto(testUrl.getUrl('officer', 'filter'))
  //values to test with
  const testFilterBy = 'birth date'
  const testOperator = FilterComparison.IS_BETWEEN
  const testMin = '2012-05-15'
  const testMax = '2015-01-03'

  // identifies the new filter div by a div containing a h3 that says 'new filter'
  const newFilterDiv = await page.$('div:has(h3:text-matches("new filter", "i"))')
  const filterBy = await newFilterDiv.$(':nth-match(select, 1)')
  await filterBy.selectOption(testFilterBy)
  const filterOperator = await newFilterDiv.$(':nth-match(select, 2)')
  await filterOperator.selectOption(testOperator.toString())
  const filterMin = await newFilterDiv.$(':nth-match(input, 1)')
  await filterMin.fill(testMin.toString())
  const filterMax = await newFilterDiv.$(':nth-match(input, 2)')
  await filterMax.fill(testMax.toString())
  const addFilterButton = await newFilterDiv.$('button:text-matches("add filter", "i")')
  await Promise.all([addFilterButton.click(), page.waitForNavigation()])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/OfficerFilter - ApplyNew.png`, fullPage: true })

  // check that filter was added and is showing an english representation
  const addedFilterDescription = await page.innerText('div:below(div:has(h3:text-matches("new filter", "i"))) p')
  expect(addedFilterDescription).toMatch(new RegExp(testFilterBy, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp(getFilterComparisonProperties(testOperator).english, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp('May')) // month from min date
  expect(addedFilterDescription).toMatch(new RegExp('Jan')) // month from max date
})
