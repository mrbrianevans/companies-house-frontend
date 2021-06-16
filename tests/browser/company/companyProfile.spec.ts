import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('test companyProfile page', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl('company', '12851415'))
  const companyName = await page.innerText('main h1')
  expect(companyName).toBeDefined()
  await page.screenshot({ path: 'screenshots/companyProfile.png' })
})
