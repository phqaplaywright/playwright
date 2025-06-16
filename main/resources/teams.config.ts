const config = {
    "teamsWebhookUrl": "https://peoplehumtech.webhook.office.com/webhookb2/5dc45bb9-a395-40eb-a2aa-d355048df524@3ec79a62-de7f-4c66-918f-7a47dcf25975/IncomingWebhook/c70709f47666441f95acd0acc5755bdd/52e8fc69-d2ee-4048-9e84-9796bf747a03/V2gRINZwoCoMDjKR3cow8p_ZMfJVZ6fH8pzhNGuAK0r441",
    "templates": {
        "POST_NOTIFICATION_SUITE_START": "Suite run started: %s",
        "POST_NOTIFICATION_SUITE_END": "Suite run finished: %s with Pass count: %s, Failed count: %s and Time taken: %s minutes",
        "POST_NOTIFICATION_TEST_COMPLETED": "Module run finished: %s, Pass count: %s, Failed count: %s and Time taken: %s minutes. Failed tests are: %s",
        "POST_NOTIFICATION_TEST_COMPLETED_NO_FAIL": "Module run finished: %s, Pass count: %s, Failed count: %s and Time taken: %s minutes."
    },
}

export { config as teamsConfig };