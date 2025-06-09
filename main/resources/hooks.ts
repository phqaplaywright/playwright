import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import addAttachment from '@reportportal/agent-js-playwright';


test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const screenshot = await page.screenshot({ fullPage: true });
    await testInfo.attach('Failure Screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });

    if (testInfo.error) {
      console.error(`Error Message: ${testInfo.error.message}`);    }
  }
});
