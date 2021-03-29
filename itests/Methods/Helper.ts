import { ClientFunction, Selector } from 'testcafe';

const USERAGENT = ClientFunction(() => navigator.userAgent);

export class Helper {
    static async navigateTo(
        t: TestController,
        url: string
    ): Promise<void> {
        await t.navigateTo(url);
        await t.wait(1000);
    }

    static async isElementPresent(
        t: TestController,
        element: Selector,
    ): Promise<void> {
        await t.expect(
            element.visible
        ).ok({ timeout: 60000 });
    }

    static async isElementAbsent(
        t: TestController,
        element: Selector,
    ): Promise<void> {
        await t.expect(
            element.exists
        ).notOk({ timeout: 60000 });
    }

    static async maximizeWindow(
        t: TestController
    ): Promise<void> {
        await t.maximizeWindow();
    }

    static async fetchBrowser(): Promise<string> {
        const useragent = await USERAGENT().then((result) => result);
        let browser;
        if (useragent.indexOf('Firefox') > -1) {
            browser = 'Firefox';
        } else if (useragent.indexOf('Trident') > -1) {
            browser = 'Internet Explorer';
        } else if (useragent.indexOf('Chrome') > -1) {
            browser = 'Chrome';
        } else if (useragent.indexOf('Safari') > -1) {
            browser = 'Safari';
        } else {
            browser = 'unknown';
        }
        return browser;
    }

    static async click(
        t: TestController,
        element: Selector
    ): Promise<void> {
        try {
            await this.isElementPresent(t, element);
            await t.click(element);
            await t.wait(500);
        } catch (error) {
            console.log(error);
            throw Error('Unable to click on the element: ' + element);
        }
    }

    static async sizeOfElement(
        element: Selector,
    ): Promise<number> {
        return await element.count.then(
            (result) => result
        );
    }

    static async getElementText(
        element: Selector,
    ): Promise<any> {
        return element.innerText;
    }

    static async assertText(
        t: TestController,
        element: Selector,
        expectedFieldValue: string,
    ): Promise<void> {
        const actualFieldValue: string =
            await this.getElementText(
                element
            );
        await t.expect(
            actualFieldValue
        ).eql(expectedFieldValue);
    }

    public static getElementAttribute(
        element: Selector,
        attribute: string,
    ): Promise<string> {
        return element.getAttribute(attribute);
    }

    static async waitForElementToDisappear(
        t: TestController,
        element: Selector,
    ): Promise<void> {
        if ((await this.sizeOfElement(element)) > 0) {
            await t.expect(
                element.exists
            ).notOk({ timeout: 60000 });
        }
    }

    static async waitForElementToAppear(
        t: TestController,
        element: Selector,
    ): Promise<void> {
        let i = 0;
        while ((await this.sizeOfElement(element)) === 0) {
            await t.wait(1000);
            i++;
            if (i === 60) {
                break;
            }
        }
    }

    static async getPageURL(): Promise<string> {
        const getURL = ClientFunction(() => window.location.href);
        return await getURL();
    }

    static async validateURL(
        t: TestController,
        expectedUrlSubstring: string,
    ): Promise<void> {
        const actualUrl = await this.getPageURL();
        await t.expect(
            actualUrl
        ).contains(expectedUrlSubstring);
    }

    static async clearAndEnterText(
        t: TestController,
        element: Selector,
        value: string,
    ): Promise<void> {
        try {
            await this.isElementPresent(t, element);
            await t.typeText(
                element,
                value,
                { replace: true, paste: true },
            );
        } catch (error) {
            console.log(error);
        }
    }

    static async clearTextField(
        t: TestController,
        element: Selector,
    ): Promise<void> {
        await this.isElementPresent(t, element);
        await t.click(
            element
        ).pressKey('ctrl+a delete');
    }

    static async enterText(
        t: TestController,
        element: Selector,
        value: string,
    ): Promise<void> {
        try {
            await this.isElementPresent(t, element);
            await t.selectText(element).pressKey('delete');
            await t.typeText(element, value);
        } catch (error) {
            console.log(error);
        }
    }

    static async getInputText(
        element: Selector,
    ): Promise<any> {
        return await element.value;
    }

    static async refreshPage(
        t: TestController
    ): Promise<void> {
        await t.eval(
            () => location.reload()
        );
    }

    static async getElementStyle(
        styleProperty: string,
        selector: Selector,
    ): Promise<string> {
        const value: string = await selector
            .getStyleProperty(styleProperty)
            .then((result) => result);
        return value;
    }
}