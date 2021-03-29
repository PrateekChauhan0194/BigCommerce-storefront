import { Given } from 'cucumber';
import { Categories } from '../Methods/Categories';

Given(/^This is a test step$/,
    async (t: any, []: string[]) => {
        await Categories.testMethod(t);
});