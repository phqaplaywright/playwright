import { request } from '@playwright/test';

export default class TeamsNotificationHandler {
    private readonly teamsWebhookUrl = "https://peoplehumtech.webhook.office.com/webhookb2/5dc45bb9-a395-40eb-a2aa-d355048df524@3ec79a62-de7f-4c66-918f-7a47dcf25975/IncomingWebhook/c70709f47666441f95acd0acc5755bdd/52e8fc69-d2ee-4048-9e84-9796bf747a03/V2gRINZwoCoMDjKR3cow8p_ZMfJVZ6fH8pzhNGuAK0r441";

    async postRunStartNotification(suiteName: string): Promise<boolean> {
        console.log(`Sending start notification for suite: ${suiteName}`);
        const body = { 
            text: `Suite run started: ${suiteName}` 
        };
        return this.sendTeamsNotification(body);
    }

    async postRunEndNotification(suiteName: string, passCount: number, failCount: number, timeTaken: number, failedTests: Array<{name: string, error?: string}>): Promise<boolean> {
    console.log(`Sending end notification for suite: ${suiteName}, Pass: ${passCount}, Fail: ${failCount}`);
    const failedTestNames = failedTests.map(test => test.name.split(':')[0].trim());
    console.log('Failed test names:', failedTestNames); // Debug log
    
    let message = `Suite run finished: ${suiteName} with Pass count: ${passCount}, Failed count: ${failCount} and Time taken: ${timeTaken} minutes`;
    
    if (failedTests.length > 0) {
        message += '\nFailed tests are:';
        // Add double newline between each test name
        message += failedTestNames.map(name => `\n\n${name}`).join('');
    }

    const body = { text: message };
    return this.sendTeamsNotification(body);
    }

    async postModuleEndNotification( moduleName: string, passCount: number, failCount: number, timeTaken: number, failedTests: Array<{name: string, error?: string}> ): Promise<boolean> {
    console.log(`Sending module end notification for: ${moduleName}`);
    const failedTestNames = failedTests.map(test => test.name.split(':')[0].trim());
    console.log('Failed test names:', failedTestNames); // Debug log
    
    let message = `Module run finished: ${moduleName}, Pass count: ${passCount}, Failed count: ${failCount} and Time taken: ${timeTaken} minutes`;
    
    if (failedTests.length > 0) {
        message += '\nFailed tests are:';
        message += failedTestNames.map(name => `\n${name}`).join('');
    }

    const body = { text: message };
    return this.sendTeamsNotification(body);
    }

    private async sendTeamsNotification(body: any): Promise<boolean> {
        console.log('Attempting to send Teams notification...');
        console.log('Request body:', JSON.stringify(body, null, 2));
        
        const apiContext = await request.newContext();
        try {
            const response = await apiContext.post(this.teamsWebhookUrl, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: body
            });
            
            console.log('Teams API Response status:', response.status());
            console.log('Teams API Response:', await response.text());
            
            if (!response.ok()) {
                console.error('Teams notification failed:', await response.text());
                return false;
            }
            
            console.log('Teams notification sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending Teams notification:', error);
            if (error instanceof Error) {
                console.error('Error details:', error.message);
                console.error('Stack trace:', error.stack);
            }
            return false;
        } finally {
            await apiContext.dispose();
        }
    }

    // ... rest of the class remains the same
}