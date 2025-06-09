import { test, expect } from '@playwright/test';

test('Apply unpaid leave', async ({ page }) => {
  // Step 1 & 2: Launch browser and navigate to URL
  await page.goto('/');
  
  // Step 3: Login and verify homepage
  await page.waitForSelector('input[name="user_name"]');
  await page.fill('input[name="user_name"]', 'nithyasubhiksha@gmail.com');
  await page.fill('input[name="password"]', 'Test@123');
  await page.click('button[type="submit"]');
  
  // Wait for navigation and dashboard to load
  await page.waitForLoadState('networkidle');
  
  // Verify successful login
  await expect(page).toHaveURL(/.*homepage/);
  
  // Step 4: Click on "Apply leave(s)"
  const applyLeaveButton = page.locator("xpath=(//span[text()='Apply leave(s)'])[1]");
  await applyLeaveButton.waitFor({ state: 'visible', timeout: 10000 });
  await applyLeaveButton.click();
  
  // Step 5: Click "UnPaid"
  await page.waitForSelector('text=UnPaid', { state: 'visible', timeout: 5000 });
  await page.click('text=UnPaid');
  
  // Step 6: Verify Leave Type
  await expect(page.locator('text="Leave Type"')).toBeVisible();
  
  // Step 7: Select dates
  await page.waitForSelector('input[placeholder="From Date"]');
  await page.fill('input[placeholder="From Date"]', '2025-05-23');
  await page.fill('input[placeholder="To Date"]', '2025-05-24');
  
  // Wait for total days calculation
  await page.waitForTimeout(1000);
  
  // Step 8: Verify Total Days
  const totalDaysElement = await page.waitForSelector('.total-days');
  const totalDays = await totalDaysElement.textContent();
  expect(totalDays?.trim()).toBe('2');
  
  // Step 9: Add description
  await page.fill('textarea[placeholder="Add description"]', 'Personal leave - Unpaid leave application for two days');
  
  // Step 10: Click Apply
  await page.click('button:has-text("Apply")');
  
  // Step 11: Verify successful application
  await expect(page.locator('text=Leave applied successfully')).toBeVisible({ timeout: 10000 });
});
