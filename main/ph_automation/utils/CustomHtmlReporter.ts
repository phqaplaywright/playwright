import { Reporter, TestCase, TestResult, Suite, FullConfig } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

export default class CustomHtmlReporter implements Reporter {
  private results: any[] = [];
  private startTime: number = 0;
  private outputDir: string = process.cwd();

  onBegin(config: FullConfig, suite: Suite) {
  this.startTime = Date.now();
  this.outputDir = "/Users/vivekanandan/Desktop/playwright/test-results";
}

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push({
      title: test.title,
      status: result.status,
      error: result.error?.stack,
      duration: result.duration,
      file: test.location.file,
      startTime: result.startTime,
      endTime: (result.startTime instanceof Date ? result.startTime.getTime() : result.startTime) + result.duration,
    });
  }

  async onEnd() {
    const duration = Math.round((Date.now() - this.startTime) / 1000);
    const pass = this.results.filter(r => r.status === 'passed').length;
    const fail = this.results.filter(r => r.status === 'failed').length;
    const skip = this.results.filter(r => r.status === 'skipped').length;

    let html = `
      <html>
      <head>
        <title>PeopleHum UI Automation Report</title>
        <style>
          body { font-family: Arial; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; }
          th { background: #eee; }
          .passed { background: #c8e6c9; }
          .failed { background: #ffcdd2; }
          .skipped { background: #ffe0b2; }
        </style>
      </head>
      <body>
        <center><h1>PeopleHum UI Automation Report - ${new Date().toLocaleString()}</h1></center>
        <p><b>Duration:</b> ${duration}s</p>
        <p><b>Passed:</b> ${pass} | <b>Failed:</b> ${fail} | <b>Skipped:</b> ${skip}</p>
        <table>
          <tr>
            <th>Test</th>
            <th>Status</th>
            <th>Duration (ms)</th>
            <th>Error</th>
            <th>File</th>
          </tr>
          ${this.results.map(r => `
            <tr class="${r.status}">
              <td>${r.title}</td>
              <td>${r.status}</td>
              <td>${r.duration}</td>
              <td>${r.error ? r.error.replace(/</g, '&lt;').replace(/>/g, '&gt;') : ''}</td>
              <td>${r.file}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;

    const outPath = path.resolve(this.outputDir, 'custom-playwright-report.html');
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`Custom HTML report generated: ${outPath}`);
  }
}