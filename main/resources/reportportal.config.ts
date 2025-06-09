export const config = {
  // Required
  endpoint: "http://reportportal.peoplehum.org:8080",
  apiKey: "a5e79702-bfb6-4d23-a19b-0987c2c07012",
  launch: "superadmin_TEST_EXAMPLE",
  project: "superadmin_personal",

  // Optional
  enable: true,
  description: "test Results",
  attributes: [
    { key: "tag", value: "robot" },
    { key: "tag", value: "test" }
  ],
  mode: "DEFAULT",
  isSkippedIssue: true,
  logBatchSize: 20
};
