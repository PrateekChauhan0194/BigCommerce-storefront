import { Helper } from "./Helper";
import { product } from "../Pages/Product.page";

export class Product {
    static async goToProduct(
        t: TestController,
        productName: string
    ): Promise<void> {
        console.log(`START - Navigating to '${productName}' page`);
        await Helper.navigateTo(
            t,
            `${product.pageUrl}?productName=${productName}`,
        );
        console.log(`COMPLETED - Navigating to '${productName}' page`);
    }

    static async validatePresenceOfMainContainer(
        t: TestController
    ) {
        console.log(
            'START - Validating the presence of main \'product\' container.'
        );
        await Helper.isElementPresent(
            t,
            product.elements.mainContainer,
        );
        console.log(
            'COMPLETED - Validating the presence of main \'product\' container.'
        );
    }
}