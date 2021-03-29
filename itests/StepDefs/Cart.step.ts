import { Given } from "cucumber";
import { Cart } from '../Methods/Cart';
import {Then} from 'cucumber'
import {Product} from "../Methods/Product";

Given(/^I am on cart page$/,
    // @ts-ignore
    async (t: TestController, [productName]: string[]) => {
    await Cart.goToCart(t);
});

Then(/^I validate that the main container for cart page is present$/,
    // @ts-ignore
    async (t: TestController, []: string[]) => {
        await Cart.validatePresenceOfMainContainer(t);
});