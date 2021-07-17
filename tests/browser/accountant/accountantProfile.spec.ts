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

test('accountant profile without company number loads without errors', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const requestedName = 'Christopher Bailey'
  await page.goto(testUrl.getUrl('accountants', requestedName))
  const responseName = await page.innerText('main h1')
  expect(responseName).toBe(requestedName)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/accountantProfileWithoutCompanyNumber.png` })
})

test('accountant profile with company number loads without errors', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const requestedName = 'Bick Accountants Limited'
  await page.goto(testUrl.getUrl('accountants', requestedName))
  const responseName = await page.innerText('main h1')
  expect(responseName).toBe(requestedName)
  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/accountantProfileWithCompanyNumber.png` })
})

test('non existent accountant returns a 404', async ({ page, port }) => {
  const testUrl = new TestUrl({ port })
  const requestedName = 'i dont exist laksjdhf'
  await page.goto(testUrl.getUrl('accountants', requestedName))
  await page.waitForSelector(':not(:has-text("loading"))')
  const allPageText = await page.innerText('main')
  expect(allPageText).toMatch(/not found/i)
  expect(allPageText).toMatch(/404/i)

  await page.screenshot({ path: `${process.env.BROWSER_TEST_OUTPUT_DIR}/accountantProfileNotFound.png` })
})
