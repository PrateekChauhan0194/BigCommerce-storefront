import { Given, Then } from 'cucumber';
import { Categories } from '../Methods/Categories';

Given(/^I am on categories page$/,
    async (t: TestController, []: string[]) => {
        await Categories.goToCategories(t);
});

Then(/^I validate that the main container for categories page is present$/,
    async (t: TestController, []: string[]) => {
        await Categories.validatePresenceOfMainContainer(t);
});