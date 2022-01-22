const assert = require('assert');
const nock = require('nock');
const { SmsClient, SmsMessage, SmsError, SmsErrorCode, SmsMessageStatus } = require('../lib/sms.js');

describe('SMS client tests', () => {
    var smsClient = new SmsClient('login', 'password');

    describe('sendMessage tests', () => {
        it('sendMessage returns messageId', async () => {
            let expectedMessageId = 31885463;

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('send'))
                .reply(200, `["msgid","${expectedMessageId}"]`);

            const messageId = await smsClient.sendMessage(new SmsMessage('', '', '', true));
            assert.equal(messageId, expectedMessageId);
        });

        it('sendMessage returns decision telecom error', async () => {
            let expectedErrorCode = SmsErrorCode.InvalidLoginOrPassword;

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('send'))
                .reply(200, `["error",${expectedErrorCode.code}]`);

            try {
                await smsClient.sendMessage(new SmsMessage('', '', '', true));
            } catch (error) {
                assert.ok(error instanceof SmsError);
                assert.equal(error.errorCode, expectedErrorCode);
            }
        });

        it('sendMessage returns unsuccessful status cod', async () => {
            var expectedError = new Error('An error occurred while processing request. Response code: 401 (Unauthorized)')

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('send'))
                .reply(401, function(uri, requestBody) {
                    this.req.response.statusMessage = 'Unauthorized';
                    return {
                        status: 401,
                        message: 'Unauthorized Error'
                    };
                });

            try {
                await smsClient.sendMessage(new SmsMessage('', '', '', true));
            } catch (error) {
                assert.ok(error instanceof Error);
                assert.ok(!(error instanceof SmsError));
                assert.equal(error.message, expectedError.message);
            }
        });
    });

    describe('getMessageStatus tests', () => {
        it('getMessageStatus returns status code', async () => {
            var expectedStatus = SmsMessageStatus.Delivered;

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('state'))
                .reply(200, `["status","${expectedStatus.status}"]`);

            const status = await smsClient.getMessageStatus(124);
            assert.equal(status, expectedStatus);
        });

        it('getMessageStatus returns status without code', async () => {
            var expectedStatus = SmsMessageStatus.Unknown;

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('state'))
                .reply(200, `["status",""]`);

            const status = await smsClient.getMessageStatus(124);
            assert.equal(status, expectedStatus);
        });

        it('getMessageStatus returns decision telecom error', async () => {
            let expectedErrorCode = SmsErrorCode.InvalidLoginOrPassword;

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('state'))
                .reply(200, `["error",${expectedErrorCode.code}]`);

            try {
                await smsClient.getMessageStatus(124);
            } catch (error) {
                assert.ok(error instanceof SmsError);
                assert.equal(error.errorCode, expectedErrorCode);
            }
        });

        it('getMessageStatus returns unsuccessful status code', async () => {
            var expectedError = new Error('An error occurred while processing request. Response code: 401 (Unauthorized)')

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('state'))
                .reply(401, function(uri, requestBody) {
                    this.req.response.statusMessage = 'Unauthorized';
                    return {
                        status: 401,
                        message: 'Unauthorized Error'
                    };
                });

            try {
                await smsClient.getMessageStatus(124);
            } catch (error) {
                assert.ok(error instanceof Error);
                assert.ok(!(error instanceof SmsError));
                assert.equal(error.message, expectedError.message);
            }
        });
    });

    describe('getBalance tests', () => {
        it('getBalance returns balance data', async () => {
            var expectedBalance = -791.8391870;
            var expectedCredit = 1000;
            var expectedCurrency = "EUR";

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('balance'))
                .reply(200, `["balance":"${expectedBalance}","credit":"${expectedCredit}","currency":"${expectedCurrency}"]`);

            const balance = await smsClient.getBalance();

            assert.ok(balance != null);
            assert.ok(typeof balance === 'object');
            assert.equal(balance.balance, expectedBalance);
            assert.equal(balance.credit, expectedCredit);
            assert.equal(balance.currency, expectedCurrency);
        });

        it('getBalance returns decision telecom error', async () => {
            let expectedErrorCode = SmsErrorCode.InvalidLoginOrPassword;
            
            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('balance'))
                .reply(200, `["error",${expectedErrorCode.code}]`);

            try {
                await smsClient.getBalance();
            } catch (error) {
                assert.ok(error instanceof SmsError);
                assert.equal(error.errorCode, expectedErrorCode);
            }
        });

        it('getBalance returns unsuccessful status code', async () => {
            var expectedError = new Error('An error occurred while processing request. Response code: 401 (Unauthorized)')

            nock('https://web.it-decision.com/ru/js')
                .get(uri => uri.includes('balance'))
                .reply(401, function(uri, requestBody) {
                    this.req.response.statusMessage = 'Unauthorized';
                    return {
                        status: 401,
                        message: 'Unauthorized Error'
                    };
                });

            try {
                await smsClient.getBalance();
            } catch (error) {
                assert.ok(error instanceof Error);
                assert.ok(!(error instanceof SmsError));
                assert.equal(error.message, expectedError.message);
            }
        });
    });
});