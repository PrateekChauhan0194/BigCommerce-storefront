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
}