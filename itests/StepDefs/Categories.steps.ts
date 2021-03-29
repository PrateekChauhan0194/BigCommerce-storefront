import { Given } from 'cucumber';
import { Categories } from '../Methods/Categories';

Given(/^This is a test step$/,
    // @ts-ignore
    async (t: TestController, []: string[]) => {
        await Categories.testMethod(t);
});