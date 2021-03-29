import { Helper } from "./Helper";
import { cart } from "../Pages/Cart.page";

export class Cart {

    static async goToCart(
        // @ts-ignore
        t: TestController
    ) {
        console.log('START - Navigating to the cart page');
        await Helper.click(
            t,
            cart.elements.btnCart,
        );
        console.log('COMPLETED - Navigating to the cart page');
    }

    static async validatePresenceOfMainContainer(
        t: TestController
    ) {
        console.log(
            'START - Validating the presence of main \'product\' container.'
        );
        await Helper.isElementPresent(
            t,
            cart.elements.mainContainer,
        );
        console.log(
            'COMPLETED - Validating the presence of main \'product\' container.'
        );
    }
}