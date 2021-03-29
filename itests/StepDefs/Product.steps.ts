import { Given, Then } from 'cucumber';
import { Product } from '../Methods/Product';

Given(/^I am on product page$/,
    // @ts-ignore
    async (t: TestController, [productName]: string[]) => {
    await Product.goToProduct(t, productName);
});

Then(/^I validate that the main container for product page is present$/,
    // @ts-ignore
    async (t: TestController, [productName]: string[]) => {
    await Product.validatePresenceOfMainContainer(t);
});