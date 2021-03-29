export class Categories {
    // @ts-ignore
    static async testMethod(t: TestController) {
        await t.expect(true).eql(true);
        console.log('This is a test method');
    }
}