import { test, expect } from '@playwright/test';
import { JobApplicationPage } from '../pages/JobApplicationPage';

test.describe('External job Application Flow', () => {
    let jobApplicationPage: JobApplicationPage;

    test('Create applicant via external flow', async ({ page }) => {
        const jobApp = new JobApplicationPage(page);
        const timestamp = Date.now();
        const testEmail = `automation.test${timestamp}@peoplehum.com`;
        const applicantName = 'Automation Test';
        const jobName = 'ASD';  // Update this to match your actual job name in the system

    await jobApp.login('bingo@gmail.com', 'Test@123');
    await jobApp.navigateToJobs();
    // Generate external link
    const link = await jobApp.generateExternalJobLink('Agency', 'AgentVivek');
    await jobApp.applyViaExternalLink(link, applicantName, testEmail);});
});