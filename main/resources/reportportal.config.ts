const config = {
  endpoint: 'http://reportportal.peoplehum.org:8080/api/v1',
  apiKey: 'a5e79702-bfb6-4d23-a19b-0987c2c07012',
  launch: 'superadmin_TEST_EXAMPLE',
  project: 'superadmin_personal',
  enable: true,
  description: 'test Results',
  attributes: [
    { key: 'tag', value: 'robot' },
    { key: 'tag', value: 'test' }
  ],
  mode: 'DEFAULT',
  isSkippedIssue: true,
  logBatchSize: 20,

  reporterOptions: {
    attachScreenshotOnFail: true,
    attachConsoleLog: true,
    autoAttachErrorContext: false
  },
};

export { config };