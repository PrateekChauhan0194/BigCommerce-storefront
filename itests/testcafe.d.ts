declare module 'storefront' {
    global {
        interface TestController {
            testRun: {
                test: {
                    name: string;
                    testFile: {
                        currentFixture: {
                            name: string;
                        };
                    };
                };
            };
        }
    }
}
