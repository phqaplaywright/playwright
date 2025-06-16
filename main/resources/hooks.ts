import { Page, TestInfo } from '@playwright/test';
import addAttachment from '@reportportal/agent-js-playwright';

// Export the screenshot capture function as default
export default async function captureScreenshotOnFailure(page: Page, testInfo: TestInfo) {
    if (testInfo.status !== testInfo.expectedStatus) {
        const screenshot = await page.screenshot({ fullPage: true });
        await testInfo.attach('Failure Screenshot', {
            body: screenshot,
            contentType: 'image/png',
        });

        if (testInfo.error) {
            console.error(`Error Message: ${testInfo.error.message}`);
        }
    }
}