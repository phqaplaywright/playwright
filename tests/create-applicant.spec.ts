import { test, expect } from '@playwright/test';
import { CreateApplicantPage } from '../pages/CreateApplicantPage';
import type { Applicant } from '../pages/CreateApplicantPage';
import path from 'path';

test.describe('Create Applicant Flow', () => {
    let createApplicantPage: CreateApplicantPage;

    test('Create new applicant', async ({ page }) => {
    const applicantTest = new CreateApplicantPage(page);
    const timestamp = Date.now();
    
    // Test data for draft
    const newApplicant: Applicant = {
        name: `Applicant ${timestamp}`,
        email: `applicant${timestamp}@peoplehum.com`,
        jobProfile: 'ASD',
        sourceType: 'Agency',
        sourceName: 'Vivek',
        resumePath: '/Users/vivekanandan/Desktop/playwright/test-data/resume.pdf',
        autoGenerateApplicantId: true
    };

    // Execute test steps
    await applicantTest.login('bingo@gmail.com', 'Test@123');
    await applicantTest.navigateToApplications();
    await applicantTest.createNewApplication(newApplicant);
    await applicantTest.verifyApplicantCreated(newApplicant.name);});

});
