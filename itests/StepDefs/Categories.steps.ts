import { Given, Then } from 'cucumber';
import { Categories } from '../Methods/Categories';

Given(/^I am on categories page$/,
    async (t: TestController) => {
        await Categories.goToCategories(t);
});

Then(/^I validate that the main container for categories page is present$/,
    async (t: TestController) => {
        await Categories.validatePresenceOfMainContainer(t);
});
