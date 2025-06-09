import { Page, expect } from '@playwright/test';

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export class JobApplicationPage {
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

    async navigateToJobs() {
    // Navigate to HIRE > JOBS
    await this.page.hover('text=HIRE');
    await this.page.click('text=JOBS');
    await this.page.waitForLoadState('networkidle');
    await this.page.click('xpath=//div[@class="datatable-body-cell-label"]//span[text()="ASD"]');
    await this.page.waitForTimeout(1000);
  }

    async generateExternalJobLink(sourceType: string, sourceName: string) {
    // Click source type dropdown
    await this.page.evaluate(() => window.scrollBy(0, 500)); // Ensure the dropdown is visible
    if (!await this.page.isVisible(`xpath=//span[@title='${sourceName}']//ancestor::div[contains(@class,"datatable-row-center")]`)) {
        // If the source name already exists, click on it
    await this.page.click('xpath=//ng-select[@name="source_type"]//div[contains(@class,"ng-select-container")]');
    await this.page.click(`xpath=//span[text()='${sourceType}']/ancestor::div[@role="option"]`);

    // Click source name dropdown
    await this.page.click('xpath=//ng-select[@name="source_name"]//div[contains(@class,"ng-select-container")]');
    await this.page.fill('xpath=//ng-select[@name="source_name"]//input', sourceName);
    await this.page.click(`xpath=//span[text()='${sourceName}']/ancestor::div[@role="option"]`);

    // Click generate link
    await this.page.click('xpath=//button[normalize-space()="Generate Link"]');

    // Wait for success message
    await this.page.waitForSelector('xpath=//div[contains(@class,"alert-toast")]//span[text()="Job application link created successfully"]');
  }
    
    // Get the generated link from the first row
    const link = await this.page.locator('xpath=//datatable-row-wrapper[1]//datatable-body-cell[count(//datatable-header-cell[contains(@title,"Link")]/preceding-sibling::datatable-header-cell)+1]//span').textContent();
    if (!link) throw new Error('Failed to get the generated link');
    return link;
  }

    async applyViaExternalLink(link: string, firstName: string, email: string) {
    await this.page.goto(link);
    await this.page.waitForLoadState('networkidle');

    // Fill application form
    await this.page.fill('input[placeholder="Enter applicant email"]', email);
    await this.page.click('xpath=(//button[text()="Apply"])[1]'); 
    
    await this.page.fill('input[placeholder="Enter First Name"]', firstName);
    await this.page.setInputFiles('input[type="file"]', '/Users/vivekanandan/Desktop/playwright/test-data/resume.pdf');  // You'll need to update this path
    await delay(3000);
    await this.page.click('xpath=(//button[text()="Submit"])[1]'); 
    await this.page.click('xpath=(//button[text()="Confirm"])[1]');
  }

}


