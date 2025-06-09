import { defineConfig } from '@playwright/test';
import RPReporter from "@reportportal/agent-js-playwright";
import { config as rpConfig } from './main/resources/reportportal.config';

export default defineConfig({
  testDir: './main/ph_automation/tests',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: [
    ['@reportportal/agent-js-playwright', rpConfig],
    ['html']
  ],
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 15000
  }
});