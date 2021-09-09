import { ClientFunction, Selector } from 'testcafe';
import { resources } from '../resources';
import { readFileSync, copyFileSync, writeFileSync, existsSync, mkdirSync, readdir } from 'fs';
import * as resemble from 'resemblejs';
import { FileUtils } from './FileUtils';

const USERAGENT = ClientFunction(() => navigator.userAgent);

let screenshotFolder: string;

export const setScreenshotFolder = (value: string) => {
    screenshotFolder = value;
};

export const getScreenshotFolder = (): string => screenshotFolder;

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

    static isValidatingUI(): boolean {
        const doc = readFileSync('../package.json', 'utf8');
        const packageJson = JSON.parse(doc);
        return packageJson.config.e2e_tags.toString().includes('@UIValidation');
        // return false;
    }

    static async compareImages(t: TestController, imageName: string): Promise<any> {
        const isValidate = this.isValidatingUI();
        console.log(`isValidate: ${isValidate}`);
        // -----Performing the visual validations only if 'validate' key is set to 'Y' in config AND the UIValidation tests are running-----//
        if (isValidate && resources.config.visualValidation.validate === 'Y') {
            // -----Capturing current result-----//
            const screenshotPath = `../Current/${await this.fetchBrowser()}/${getScreenshotFolder()}/` + imageName + `.png`;
            await t.takeScreenshot({ path: screenshotPath, fullPage: true });

            await t.wait(5000);

            const browserName = await this.fetchBrowser();
            const baseImage = `${resources.config.visualValidation.baseDir}/${browserName}/${getScreenshotFolder()}/${imageName}.png`;
            const currentImage = `${resources.config.visualValidation.currentDir}/${browserName}/${getScreenshotFolder()}/${imageName}.png`;
            const diffImage = `${resources.config.visualValidation.diffDir}/${browserName}/${getScreenshotFolder()}/${imageName}.png`;

            // ----Re-baselining the images if 'rebaseline' key is set to 'Y'----//
            if (resources.config.visualValidation.rebaseline === 'Y') {
                copyFileSync(currentImage, baseImage);
                console.log(`${browserName}/${getScreenshotFolder()}/${imageName}.png re-baselined.`);
            } else {
                /* -----Comparing the current image (generated in current execution) with it's baselined image----- */
                resemble(currentImage)
                    .compareTo(baseImage)
                    .onComplete(data => {
                        /* ----Diff file will only be generated if there is a mismatch in image comparison---- */
                        if (data.misMatchPercentage > 0) {
                            console.log(`Diff Image: ${diffImage}`);
                            console.log(data);
                            writeFileSync(diffImage, data.getBuffer());
                        }
                    });
            }
        }
    }

    ///// placeholder method to define output settings for specific page validations
    static async setResembleOutputSettings(pageName = 'default'): Promise<void> {
        pageName = pageName.toLowerCase();
        switch (pageName) {
            case 'checkoutreview':
                console.log('checkoutReview');
                break;
            case 'checkoutcomplete':
                console.log('checkoutComplete');
                break;
            default:
        }
    }

    static async cleanBaselineImageDir(): Promise<void> {
        if (resources.config.visualValidation.rebaseline === 'Y') {
            const rootFolderPath = `${resources.config.visualValidation.baseDir}/${await this.fetchBrowser()}`;
            if (!existsSync(rootFolderPath)) {
                mkdirSync(rootFolderPath);
            }
            const folderPath = `${resources.config.visualValidation.baseDir}/${await this.fetchBrowser()}/${getScreenshotFolder()}`;
            if (existsSync(folderPath)) {
                await FileUtils.deleteFiles(folderPath);
            }
            mkdirSync(folderPath);
        }
    }

    static async cleanDiffImageDir(): Promise<void> {
        const rootFolderPath = `${resources.config.visualValidation.diffDir}/${await this.fetchBrowser()}`;
        if (!existsSync(rootFolderPath)) {
            mkdirSync(rootFolderPath);
        }
        const folderPath = `${resources.config.visualValidation.diffDir}/${await this.fetchBrowser()}/${getScreenshotFolder()}`;
        if (existsSync(folderPath)) {
            await FileUtils.deleteFiles(folderPath);
        }
        mkdirSync(folderPath);
    }

    // ----The test will fail if there is even a single diff file generated in a scenario----//

    static async reportUIFailures(t: TestController): Promise<void> {
        if (await Helper.isValidatingUI()) {
            const folderPath = `${resources.config.visualValidation.diffDir}/${await this.fetchBrowser()}/${getScreenshotFolder()}`;
            readdir(folderPath, async (_err: NodeJS.ErrnoException | null, files) => {
                await this.assertTextValue(t, files.length.toString(), '0');
            });
        }
    }

    static async assertTextValue(t: TestController, actualText: string, expectedText: string): Promise<void> {
        await t.expect(actualText).eql(expectedText);
    }
}
