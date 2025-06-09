import { test, expect, request } from '@playwright/test';

test('Login flow via set-token + login endpoint (cookie-based)', async ({ page }) => {
  // Step 1: Create API request context
  const requestContext = await request.newContext();

  // Step 2: Set token (optional, if required by server)
  await requestContext.get('https://qa-webapi.peoplehum.org/api/internal-api/set-token', {
    headers: {
      accept: 'application/json, text/plain, */*',
      origin: 'https://qahris.peoplehum.org',
    },
  });

  // Step 3: Login
  const loginResponse = await requestContext.post('https://qa-webapi.peoplehum.org/api/internal-api/login', {
    data: {
      email: 'phhire123@gmail.com',
      password: 'Test@123',
    },
    headers: {
      'Content-Type': 'application/json',
      origin: 'https://qahris.peoplehum.org',
    },
  });

  console.log('Login response status:', loginResponse.status());
  console.log('Login response status:', loginResponse.ok()? 'Success' : 'Failed');

  // Step 4: Grab cookie state from requestContext
  const storageState = await requestContext.storageState();
  console.log('Cookies after login:', storageState.cookies);

  // Step 5: Add cookies to browser context
  await page.context().addCookies(storageState.cookies);

  // Step 6: Navigate to homepage
  await page.goto('https://qahris.peoplehum.org/homepage');
  await expect(page).toHaveURL(/.*homepage/);

  // Step 7: Extract XSRF-TOKEN cookie value
  const xsrfToken = storageState.cookies.find(c => c.name === 'XSRF-TOKEN')?.value || '';

  // Step 8: Use the same requestContext to call secure API
  const sessionResponse = await requestContext.get('/api/internal-api/manage/user-session', {
    headers: {
      accept: 'application/json, text/plain, */*',
      origin: 'https://qahris.peoplehum.org',
      referer: 'https://qahris.peoplehum.org/',
      'x-xsrf-token': xsrfToken,
    },
  });

  expect(sessionResponse.ok()).toBeTruthy();

  const sessionData = await sessionResponse.json();
  const customerId = sessionData.content?.customer?.id;
  const userId = sessionData.content?.user?.id;

  console.log('✅ customerId:', customerId);
  console.log('✅ userId:', userId);
});