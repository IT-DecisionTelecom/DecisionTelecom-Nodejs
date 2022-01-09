const assert = require('assert');
const nock = require('nock');
const { ViberClient, ViberMessage, ViberError, ViberMessageStatus, } = require('../lib/viber');

describe('Viber client tests', () => {
    var viberClient = new ViberClient('apiKey');

    describe('sendMessage tests', () => {
        it('sendMessage returns messageId', async () => {
            var expectedMessageId = 429;

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('send-viber'))
                .reply(200, `{"message_id":${expectedMessageId}}`);

            var messageId = await viberClient.sendMessage(new ViberMessage());

            assert.equal(messageId, expectedMessageId);
        });

        it('sendMessage returns decision telecom error', async () => {
            var expectedError = new ViberError("Invalid Parameter: source_addr", "Empty parameter or parameter validation error", 1, 400);

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('send-viber'))
                .reply(200, JSON.stringify(expectedError));

            try {
                await viberClient.sendMessage(new ViberMessage());
            } catch (error) {
                assert.ok(error instanceof ViberError);
                assert.equal(error.name, expectedError.name);
                assert.equal(error.message, expectedError.message);
                assert.equal(error.code, expectedError.code);
                assert.equal(error.status, expectedError.status);
            }
        });

        it('sendMessage returns unsuccessful status code', async () => {
            var expectedError = new ViberError('Unauthorized', '', 0, 401);

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('send-viber'))
                .reply(401, function(uri, requestBody) {
                    this.req.response.statusMessage = 'Unauthorized';
                    return {
                        status: 401,
                        message: 'Unauthorized Error'
                    };
                })

            try {
                await viberClient.sendMessage(new ViberMessage());
            } catch (error) {
                assert.ok(error instanceof ViberError);
                assert.equal(error.name, expectedError.name);
                assert.equal(error.status, expectedError.status);
            }
        });
    });

    describe('getMessageStatus tests', () => {
        it('getMessageStatus returns status', async () => {
            var expectedMessageId = 429;
            var expectedStatus = ViberMessageStatus.Delivered;

            var response = {
                message_id: expectedMessageId,
                status: expectedStatus.status
            };

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('receive-viber'))
                .reply(200, JSON.stringify(response));

            var receipt = await viberClient.getMessageStatus(expectedMessageId);

            assert.ok(receipt != null);
            assert.equal(receipt.messageId, expectedMessageId);
            assert.equal(receipt.status, expectedStatus);
        });

        it('getMessageStatus returns decision telecom error', async () => {
            var expectedError = new ViberError("Invalid Parameter: source_addr", "Empty parameter or parameter validation error", 1, 400);

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('receive-viber'))
                .reply(200, JSON.stringify(expectedError));

            try {
                await viberClient.getMessageStatus(429);
            } catch (error) {
                assert.ok(error instanceof ViberError);
                assert.equal(error.name, expectedError.name);
                assert.equal(error.message, expectedError.message);
                assert.equal(error.code, expectedError.code);
                assert.equal(error.status, expectedError.status);
            }
        });

        it('getMessageStatus returns unsuccessful status code', async () => {
            var expectedError = new ViberError('Unauthorized', '', 0, 401);

            nock('https://web.it-decision.com/v1/api')
                .post(uri => uri.includes('receive-viber'))
                .reply(401, function(uri, requestBody) {
                    this.req.response.statusMessage = 'Unauthorized';
                    return {
                        status: 401,
                        message: 'Unauthorized Error'
                    };
                })

            try {
                await viberClient.getMessageStatus(429);
            } catch (error) {
                assert.ok(error instanceof ViberError);
                assert.equal(error.name, expectedError.name);
                assert.equal(error.status, expectedError.status);
            }
        });
    });
});