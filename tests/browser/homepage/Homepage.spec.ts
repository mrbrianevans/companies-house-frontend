import test from '../nextFixture'
import { expect } from '@playwright/test'
import { TestUrl } from '../../helpers/TestUrl'

test('home page logo test', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl())
  const logo = await page.innerText('h1')
  expect(logo).toBe('Filter Facility')
  await page.screenshot({ path: 'screenshots/homepage.png' })
})
