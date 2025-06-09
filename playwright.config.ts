import { defineConfig } from '@playwright/test';
import RPReporter from "@reportportal/agent-js-playwright";

const rpConfig = {
  endpoint: 'http://reportportal.peoplehum.org:8080/api/v1',
  token: 'a5e79702-bfb6-4d23-a19b-0987c2c07012',
  launch: 'superadmin_TEST_EXAMPLE',
  project: 'superadmin_personal',
  enable: false,
  description: 'test Results',
  attributes: [
    { key: 'tag', value: 'robot' },
    { key: 'tag', value: 'test' }
  ],
  mode: 'DEFAULT',
  isSkippedIssue: true,
  logBatchSize: 20
};

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