import { expect, test } from '@playwright/test'

test('test dev system is live', async ({ page }) => {
  await page.goto('https://dev.filterfacility.co.uk')
  const name = await page.innerText('h1')
  expect(name).toBe('Filter Facility')
})
