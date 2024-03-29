// test for $NAME filter page
// /tests/browser/$NAME.toLowerCase()/$NAME.substring(0,1).toUpperCase()$NAME.substring(1).toLowerCase()Filter
// this file is located in: /${DIR_PATH}/${FILE_NAME}
#set($lower_first_letter = $NAME.substring(0,1).toLowerCase())
#set($upper_first_letter = $NAME.substring(0,1).toUpperCase())
#set($the_rest = $NAME.substring(1))
#set($camelName = ${lower_first_letter} + ${the_rest})
#set($PascalName = ${upper_first_letter} + ${the_rest})
#set($lower_name = ${upper_first_letter} + ${the_rest})

import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('$lower_name filter page root (no filter applied)', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('$lower_name', 'filter'))
  const title = await page.innerText('main h1')
  expect(title).toMatch(/^Filter/)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Filter - root page.png` })
})

test('$lower_name filter page - apply filter from root', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // uncomment to intercept an API call, and mock a response
  // await page.route('**/api/chApi/getFilingsList*', (route) => {
  //   console.log('Intercepted call to companies house for filing items: ', route.request().url())
  //   route.fulfill({ status: 200, body: JSON.stringify({ items: [], totalCount: 0 }) })
  // })
  await page.goto(testUrl.getUrl('$lower_name', 'filter'))
  //values to test with
  const testFilterBy = 'age'
  const testOperator = 'is between'
  const testMin = 41
  const testMax = 42

  // identifies the new filter div by a div containing a h3 that says 'new filter'
  const newFilterDiv = await page.$('div:has(h3:text-matches("new filter", "i"))')
  const filterBy = await newFilterDiv.$(':nth-match(select, 1)')
  await filterBy.selectOption(testFilterBy)
  const filterOperator = await newFilterDiv.$(':nth-match(select, 2)')
  await filterOperator.selectOption(testOperator)
  const filterMin = await newFilterDiv.$(':nth-match(input, 1)')
  await filterMin.fill(testMin.toString())
  const filterMax = await newFilterDiv.$(':nth-match(input, 2)')
  await filterMax.fill(testMax.toString())
  const addFilterButton = await newFilterDiv.$('button:text-matches("add filter", "i")')
  await Promise.all([addFilterButton.click(), page.waitForNavigation()])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Filter - ApplyNew.png`, fullPage: true })

  // check that filter was added and is showing an english representation
  const addedFilterDescription = await page.innerText('div:below(div:has(h3:text-matches("new filter", "i"))) p')
  expect(addedFilterDescription).toMatch(new RegExp(testFilterBy, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp(testOperator, 'i'))
  expect(addedFilterDescription).toMatch(new RegExp(testMin.toString()))
  expect(addedFilterDescription).toMatch(new RegExp(testMax.toString()))
})
