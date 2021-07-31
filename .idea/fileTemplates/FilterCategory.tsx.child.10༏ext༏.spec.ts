// test for $NAME search
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

test('test $PascalName Search', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('${camelName}', 'search'))
  const title = await page.innerText('main h1')
  // check the page title for something sensible like "$PascalName search" or "Search ${camelName}s"
  expect(title).toMatch(/${camelName}/i)
  expect(title).toMatch(/search/i)
    // this id might need changing to the singular label from ${camelName}Config
  await page.fill('#${camelName}SearchBox', 'david smith')

  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Search - WithQueryBeforeClick.png`,
    fullPage: true
  })

  // clicks "search" and waits for the navigation
  await Promise.all([
    page.click('button:text-matches("search", "i")'),
    page.waitForNavigation({ waitUntil: 'networkidle' })
  ])

  const titleAfterSearch = await page.innerText('main h1')

  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Search - WithQueryAfterClick.png`,
    fullPage: true
  })
  // check the title reflects that this page should contain results
  expect(titleAfterSearch).toMatch(/results/i)
})
