import { test as base } from '@playwright/test';
import captureScreenshotOnFailure from '../../resources/hooks';

// Extend the base test
export const test = base.extend({
    // Add any custom fixtures here
    page: async ({ page }, use) => {
        // Set up page
        await use(page);
    }
});

// Add the screenshot capture to afterEach
test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshotOnFailure(page, testInfo);
});

export { expect } from '@playwright/test';