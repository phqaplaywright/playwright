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
        ['html'],
        ['list'],
        ['./main/ph_automation/utils/CustomHtmlReporter'],
        ['./main/ph_automation/utils/apiHandlers/TeamsReporter'],
        ['@reportportal/agent-js-playwright', rpConfig]
    ],
    use: {
        headless: false,  // This will make the browser visible
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
        viewport: { width: 1280, height: 720 },
        actionTimeout: 15000,
        navigationTimeout: 15000,
    },
    globalSetup: './main/resources/globalSetup.ts'  // Point to the file path
    ,
});