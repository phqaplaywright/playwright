import { Page, expect } from '@playwright/test';

export interface Applicant {
    name: string;
    email: string;
    sourceType: string;
    sourceName: string;
    jobProfile?: string;
    applicantId?: string;
    autoGenerateApplicantId?: boolean;
    exhaustApplicantId?: boolean;
    resumePath?: string;
}

export class CreateApplicantPage {
    private page: Page;
    private readonly url = 'https://qahris.peoplehum.org';

    constructor(page: Page) {
        this.page = page;
    }
    

    async login(email: string, password: string) {
    await this.page.goto(this.url);
    // Wait for the login form
    await this.page.waitForSelector('input[name="user_name"]');
    // Fill login credentials
    await this.page.fill('input[name="user_name"]', email);
    await this.page.fill('input[name="password"]', password);
    // Click submit and wait for navigation
    this.page.click('button[type="submit"]');
    
    // Verify successful login by checking for dashboard element
    await expect(this.page).toHaveURL(/.*homepage/);
  }

    async navigateToApplications() {
        // Hover on HIRE and click Applications
        await this.page.hover('text=HIRE');
        await this.page.click('text=APPLICANTS');
        await this.page.waitForLoadState('networkidle');
    }

    async createNewApplication(applicant: Applicant) {
        // Click New Applicant button
        await this.page.click('xpath=//div[@class="inline-block-vertical-middle"]//button');
        await this.page.waitForLoadState('networkidle');

        // Select Job Profile if provided
        if (applicant.jobProfile) {
            await this.page.click('xpath=(//div[contains(@class,"ng-select")])[1]');
            await this.page.fill('xpath=(//div[contains(@class,"ng-input")])[1]/input', applicant.jobProfile);
            await this.page.click(`xpath=//div[contains(@class,"ng-option")]//span[contains(text(),"${applicant.jobProfile}")]`);
        }

        await this.page.click('xpath=(//ng-select[@name="sourcetype"]//div[@class="ng-select-container"])[1]');
        await this.page.click(`xpath=//span[text()='${applicant.sourceType}']/ancestor::div[@role="option"]`);
        // Click source name dropdown
        await this.page.click('xpath=(//ng-select[@bindlabel="sourcename"]//div[@class="ng-select-container"])[1]');
        await this.page.fill('xpath=(//ng-select[@bindlabel="sourcename"]//input)[1]', applicant.sourceName);
        await this.page.click(`xpath=//span[text()='${applicant.sourceName}']/ancestor::div[@role="option"]`);


        // Fill basic details
        await this.page.fill('(//input[@name="firstName"])[1]', applicant.name);
        await this.page.fill('xpath=(//input[@placeholder="Enter email"])[1]', applicant.email);
        

        // Upload resume if provided
        if (applicant.resumePath) {
            const fileChooserPromise = this.page.waitForEvent('filechooser');
            await this.page.click('xpath=//div[contains(@class,"upload-container")]//div[@class="my-drop-zone"]');
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(applicant.resumePath);
            await this.page.waitForLoadState('networkidle');
            await this.page.click('xpath=//div[@class="modal-footer"]//button[text()="No"]');
        }


            // Save and publish
        await this.page.click('xpath=//button/span[text()="Apply"]');
        await this.page.waitForSelector('text=Applicant added successfully', { timeout: 10000 });
    }

    async verifyApplicantCreated(applicantName: string) {
        // Wait for the applicant to appear in the list
        await this.page.waitForSelector(`text=${applicantName}`, { timeout: 10000 });
        const applicantElement = await this.page.locator(`text=${applicantName}`);
        await expect(applicantElement).toBeVisible();
        return true;
    }
}
