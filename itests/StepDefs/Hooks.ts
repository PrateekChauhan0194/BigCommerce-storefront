import { After, Before } from 'cucumber';
import { Helper } from '../Methods/Helper';

Before(async (t: TestController) => {
    console.log(`Running tests in: ${await Helper.fetchBrowser()}`);
    await Helper.maximizeWindow(t);
    console.log(`  Test: ${t.testRun.test.name}`);
});

After(async (t: TestController) => {
    console.log(`Execution Completed: ${t.testRun.test.name}`);
});