// playwright.config.js
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  globalSetup: './tests/browser/globalSetup.ts',
  globalTeardown: './tests/browser/afterTests.ts',
  testDir: './tests/browser'
}

export default config
