// test for $NAME profile page
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

test('test ${PascalName} Profile page loading screen', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  // random number needed to avoid hitting the cache
  const ${camelName}Id = Math.round(Math.random() * 191984630004).toString()
  await page.goto(testUrl.getUrl('${lower_name}', ${camelName}Id.padStart(12, '0')))
  const text = await page.innerText('main')
  expect(text).toMatch(/loading/i)
  await page.screenshot({
    path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Profile - LoadingScreen.png`
  })
})

test('test ${PascalName} Profile which exists', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const ${camelName}Id = '091984630004'
  // this waits for the data to be loaded in
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('${lower_name}', ${camelName}Id))
  ])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Profile - found.png`, fullPage: true })
})

test("test ${PascalName} Profile which doesn't exist", async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const ${camelName}Id = '0919840004'
  // this waits for the data to be loaded in
  await Promise.all([
    page.waitForResponse((response) => response.url().endsWith(${camelName}Id + '.json')),
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.goto(testUrl.getUrl('${lower_name}', ${camelName}Id))
  ])
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/${PascalName}Profile - invalid id.png` })
})
