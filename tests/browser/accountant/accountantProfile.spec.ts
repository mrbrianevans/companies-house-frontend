import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('accountant profile loads without errors', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const requestedName = 'Albert Goodman LLP'
  await page.goto(testUrl.getUrl('accountants', requestedName))
  const responseName = await page.innerText('main h1')
  expect(responseName).toBe(requestedName)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/accountantProfile.png` })
})
