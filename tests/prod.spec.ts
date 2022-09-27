import { expect, test } from '@playwright/test'

test('test prod system is live', async ({ page }) => {
  await page.goto('https://filterfacility.co.uk')
  const name = await page.innerText('h1')
  expect(name).toBe('Filter Facility')
})
