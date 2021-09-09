import { gunzip } from 'zlib';
import * as objectPath from 'object-path';
import { RequestLogger } from 'testcafe';

let logger: any;
/**
 * zip utilities for testcafe request logger.
 *
 * @see http://devexpress.github.io/testcafe/documentation/test-api/test-code-structure.html#using-test-controller-outside-of-test-code
 * @param {buffer} body
 */

/**
 * Unzips a response buffer from a testcafe requestlogger.🍓
 *
 * @param {*} t testcafe testController
 * @param {object}  options                   Any user params.
 * @param {buffer}  options.body              The response body of your request you want to unzip and convert to json.
 * @param {boolean} [options.toJson=false]    If true result will be return in json.
 * @param {boolean} [options.toString=false]  If true result will be return to string (using buffer.toString()).
 * @returns {promise} Returns a promise with the result. Result will be a buffer (default) a json or a string.
 */
const unzipResponseBody = async (
    t: TestController,
    options: {
        body: Buffer;
        toJson?: boolean;
        toString?: boolean;
    },
): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        gunzip(options.body, async (error, buff) => {
            if (error !== null) {
                return reject(error);
            }
            if (options.toJson === true) {
                return resolve(JSON.parse(buff.toString()));
            } else if (options.toString === true) {
                return resolve(buff.toString());
            } else {
                return resolve(buff);
            }
        });
    });
};

/**
 * Iterates through a request logger and unzips any zipped response bodies. 🍒
 * Zipped bodies are detected via the response.headers['content-encoding'] value which must be present with a value 'gzip'.
 * Your testcafe request logger should be initialized with `logResponseHeaders=true` otherwise no headers will not be present.
 * @implements {this.unzipResponseBody}
 * @see http://devexpress.github.io/testcafe/documentation/test-api/intercepting-http-requests/logging-http-requests.html#logger-properties
 * @param {*}      t                          Testcafe testController
 * @param {object} options                    Any user params.
 * @param {buffer} options.requestLogger      The request logger.
 * @param {boolean} [options.toJson=false]    If true response bodies will be replaced by a json.
 * @param {boolean} [options.toString=false]  If true response bodies will be replaced by a string (using buffer.toString()).
 * @returns {promise} Returns a promise so you can await the action to be finished. No actual data are returned.
 *                    Manipulates the options.requestLogger.requests directly!
 */
export const unzipLoggerResponses = async (
    t: TestController,
    options: {
        requestLogger: RequestLogger;
        toJson?: boolean;
        toString?: boolean;
    },
): Promise<LoggedRequest[]> => {
    const requests = options.requestLogger.requests;

    try {
        return Promise.all(
            requests.map(async (value, key) => {
                if (
                    value.response &&
                    value.response.headers &&
                    objectPath.get<string>(value.response.headers, 'content-encoding', '') === 'gzip' &&
                    Buffer.isBuffer(value.response.body)
                ) {
                    /*requests[key].response.body = */ await unzipResponseBody(t, {
                        body: value.response.body,
                        toJson: options.toJson,
                        toString: options.toString,
                    });
                }
                return requests[key];
            }),
        );
    } catch (er) {
        throw new Error(er);
    }
};

export const validateNetworkCall = async (t: TestController): Promise<any> => {
    let waitCount = 0;
    await unzipLoggerResponses(t, {
        requestLogger: logger,
        toJson: true,
        toString: false,
    });

    console.log(logger.requests);
    while (logger.requests[0] === undefined) {
        await t.wait(500);
        waitCount++;
        console.log(waitCount);
        if (waitCount === 60) {
            return undefined;
        }
    }
    console.log(`waitCount: ${waitCount}`);
    return logger.requests[0].response;
}

export const captureNetworkCall = async(t: TestController, endpointRegex: string): Promise<void> => {
    console.log(`resources.config.mockServerBaseUrl + endpointRegex --> ${ endpointRegex }`);
    logger = RequestLogger( endpointRegex, {
        // logger = RequestLogger({url: endpointRegex}, {
        logRequestHeaders: true,
        logRequestBody: true,
        logResponseHeaders: true,
        stringifyResponseBody: false,
        logResponseBody: true,
    });
    await t.addRequestHooks(logger);
}

/*
Sample:

static async captureAccountsCall(t: TestController): Promise<any> {
    // await this.captureNetworkCall(t, /api\/v1/);
    await this.captureNetworkCall(t, '/api/v1/Customer/Accounts');
    await this.refreshPage(t);
    return await this.validateNetworkCall(t);
}
*/