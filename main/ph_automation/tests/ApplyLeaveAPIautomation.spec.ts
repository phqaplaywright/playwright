import { test, expect, request } from '@playwright/test';
import { JSONPath } from 'jsonpath-plus';


test('ApplyLeaveAPIautomation', async () => {
  const baseUrl = 'https://qa-webapi.peoplehum.org';

  // Step 1: Get set-token with required headers
  const apiContext = await request.newContext();
  const setTokenResponse = await apiContext.get(`${baseUrl}/api/internal-api/set-token`, {
    headers: {
      'Origin': 'https://qahris.peoplehum.org',
      'Referer': 'https://qahris.peoplehum.org',
    },
  });

  // Step 2: Extract cookies from set-token response
  console.log('Set Token response status:', setTokenResponse.status());
  console.log('Set Token response ok:', setTokenResponse.ok());
  console.log('Set Token response text:', await setTokenResponse.text()); 
  const cookiesState = await apiContext.storageState();
  const xsrfToken = cookiesState.cookies.find(c => c.name === 'XSRF-TOKEN')?.value;
  const cookieHeader = cookiesState.cookies.map(c => `${c.name}=${c.value}`).join('; ');

  console.log('Cookie header:', cookieHeader);
  console.log('XSRF-TOKEN:', xsrfToken);

  if (!xsrfToken) {
    throw new Error('Missing cookies after login');
  }

  
  // Step 3: Login to customer
  const loginResponse = await apiContext.post(`${baseUrl}/api/web/internal-api/login`, {
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json;charset=utf-8',
      'X-Requested-With': 'XMLHttpRequest',
      'Origin': 'https://qahris.peoplehum.org',
      'Referer': 'https://qahris.peoplehum.org',
      'x-xsrf-token': xsrfToken,
    },
    data: {
      username: 'bingo@gmail.com',
      password: 'Test@123'
    }
  });
  console.log('Login response status:', loginResponse.status());
  console.log('Login response ok:', loginResponse.ok());
  console.log('Login response text:', await loginResponse.text()); 
  expect(loginResponse.ok()).toBeTruthy();

  // Step 4: Get user-session
  const userSessionResponse = await apiContext.get(`${baseUrl}/api/internal-api/manage/user-session`, {
    headers: {
      'Referer': 'https://qahris.peoplehum.org',
      'Origin': 'https://qahris.peoplehum.org',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
      'Accept': 'application/json, text/plain, */*',
      'x-xsrf-token': xsrfToken,
    }
  });

  console.log('User session response status:', userSessionResponse.status());
  const sessionBody = await userSessionResponse.json();
  const customerId = sessionBody?.content?.customer?.id;
  const userId = sessionBody?.content?.user?.id;

  if (!customerId || !userId) {
    throw new Error('Failed to extract customerId or userId from user-session response');
  }

  console.log(`✅ customerId: ${customerId}, userId: ${userId}`);

  // Step 5: Fetch leave details
  const leaveDetailsResponse = await apiContext.fetch(
    `${baseUrl}/api/leave-management-service/v4.0/customer/${customerId}/userLeave/${userId}/availableLeave?isLeaveHistoryPage=false`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'Origin': 'https://qahris.peoplehum.org',
        'Referer': 'https://qahris.peoplehum.org',
      },
      data: {}
    }
  );
  console.log('Fetch Leave details response status:', leaveDetailsResponse.status());
  expect(leaveDetailsResponse.ok()).toBeTruthy();
  const leaveData = await leaveDetailsResponse.json();
  
  const leavePolicyIds = JSONPath({
    path: '$.responseObject.userLeaveCount[?(@.leaveModel.leaveCategory=="unpaid leave")].leavePolicyId',
    json: leaveData
  });
  console.log('Leave Policy IDs:', leavePolicyIds);

  // Step 6: Apply unpaid leave
  const applyLeaveResponse = await apiContext.fetch(
    `${baseUrl}/api/leave-management-service/v4.0/customer/${customerId}/userLeave`,
    {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': xsrfToken,
        'Origin': 'https://qahris.peoplehum.org',
        'Referer': 'https://qahris.peoplehum.org',
      },
      data: {
        "leaveReason": "none",
        "approverId": null,
        "leaveRequestDetailsModelList": [
          {
            "leaveApplicableDate": 1751155200000,
            "status": "FULL_DAY",
            "applicable_date": 1751135400000
          }
        ],
        "appliedForDuration": 1,
        "leaveConfigurationType": "DAYS",
        "usersTimeZone": "Asia/Calcutta",
        "customerId": customerId,
        "leaveId": leavePolicyIds[0],
        "userId": userId,
        "isCalendarSyncEnabled": false,
        "toDate": 1751241599059,
        "fromDate": 1751155200000,
        "notificationIds": [],
        "teamNotificationIds": []
      }
    }
  );

  console.log('Apply leave response status:', applyLeaveResponse.status());
  console.log('Apply leave response ok:', applyLeaveResponse.ok());
  console.log('Apply leave response text:', applyLeaveResponse.text());
  expect(applyLeaveResponse.ok()).toBeTruthy();

});