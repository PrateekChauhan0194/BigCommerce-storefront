import {Helper} from "./Helper";
import {categories} from "../Pages/Categories.page";

export class Categories {
    static async goToCategories(
        t: TestController
    ) {
        console.log(
            'START - Navigating to categories page'
        );
        await Helper.navigateTo(
            t,
            categories.pageUrl,
        );
        console.log(
            'COMPLETED - Navigating to categories page'
        );
    }

    static async validatePresenceOfMainContainer(
        t: TestController
    ) {
        console.log(
            'START - Validating the presence of main categories container.'
        );
        await Helper.isElementPresent(
            t,
            categories.elements.mainContainer,
        );
        console.log(
            'COMPLETED - Validating the presence of main categories container.'
        );
    }
}