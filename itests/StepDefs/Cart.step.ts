import { Given } from "cucumber";
import { Cart } from '../Methods/Cart';
import {Then} from 'cucumber'
import {Product} from "../Methods/Product";

Given(/^I am on cart page$/,
    async (t: TestController) => {
    await Cart.goToCart(t);
});

Then(/^I validate that the main container for cart page is present$/,
    async (t: TestController) => {
        await Cart.validatePresenceOfMainContainer(t);
});
