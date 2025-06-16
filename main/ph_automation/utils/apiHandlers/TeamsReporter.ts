import { Reporter, TestCase, TestResult, FullConfig, Suite } from '@playwright/test/reporter';
import TeamsNotificationHandler from './TeamsNotificationHandler';

export default class TeamsReporter implements Reporter {
    private teamsHandler: TeamsNotificationHandler;
    private startTime: number;
    private passCount = 0;
    private failCount = 0;
    private skippedCount = 0;
    private failedTests: { name: string; error?: string }[] = [];

    constructor() {
        console.log('TeamsReporter initialized');
        this.teamsHandler = new TeamsNotificationHandler();
        this.startTime = Date.now();
        // Explicitly initialize arrays
        this.failedTests = [];
    }

    async onBegin(config: FullConfig, suite: Suite) {
        console.log('Test suite beginning...');
        // Reset counters at the start
        this.passCount = 0;
        this.failCount = 0;
        this.skippedCount = 0;
        this.failedTests = [];
        
        try {
            await this.teamsHandler.postRunStartNotification(suite.title || 'Playwright Tests');
        } catch (error) {
            console.error('Error in onBegin:', error);
        }
    }

    async onTestEnd(test: TestCase, result: TestResult) {
        console.log(`Test ended: ${test.title} with status: ${result.status}`);
        try {
            switch(result.status) {
                case 'passed':
                    this.passCount++;
                    console.log(`Pass count incremented to: ${this.passCount}`);
                    break;
                case 'failed':
                    this.failCount++;
                    console.log(`Fail count incremented to: ${this.failCount}`);
                    this.failedTests.push({
                        name: test.title,
                        error: result.error?.message
                    });
                    console.log('Added failed test:', test.title);
                    console.log('Current failed tests:', this.failedTests.map(t => t.name));
                    break;
                case 'skipped':
                    this.skippedCount++;
                    console.log(`Skip count incremented to: ${this.skippedCount}`);
                    break;
                default:
                    console.log(`Unhandled test status: ${result.status}`);
            }
        } catch (error) {
            console.error('Error in onTestEnd:', error);
        }
    }

    async onEnd() {
        console.log('Test suite ending...');
        const duration = Math.floor((Date.now() - this.startTime) / 60000);
        
        console.log('Final test results before sending:', {
            passed: this.passCount,
            failed: this.failCount,
            skipped: this.skippedCount,
            failedTests: this.failedTests.map(t => t.name)
        });

        try {
            await this.teamsHandler.postRunEndNotification(
                'Playwright Tests',
                this.passCount,
                this.failCount,
                duration,
                this.failedTests
            );
        } catch (error) {
            console.error('Error in onEnd:', error);
        }
    }
}