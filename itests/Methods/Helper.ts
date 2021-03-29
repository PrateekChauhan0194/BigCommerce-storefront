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
}