import { After, Before } from 'cucumber';
import { Helper } from '../Methods/Helper';

// @ts-ignore
Before(async (t: TestController) => {
    console.log(`Running tests in: ${await Helper.fetchBrowser()}`);
    await Helper.maximizeWindow(t);
    console.log(`  Test: ${t.testRun.test.name}`);
});

// @ts-ignore
After(async (t: TestController) => {
    console.log(`  Execution Completed: ${t.testRun.test.name}`);
});