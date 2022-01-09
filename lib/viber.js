const request = require('request');
const { Enumify } = require('enumify');

class ViberError extends Error {
    constructor(name, message, code, status) {
        super('Viber error: ' + message);
        this.name = name;
        this.message = message;
        this.code = code;
        this.status = status;
    }

    static fromJSON(json) {
        var data = JSON.parse(json);
        return new ViberError(data.name, data.message, data.code, data.status);
    }
}

class ViberMessageType extends Enumify{
    static textOnly = new ViberMessageType(106);
    static textImageButton = new ViberMessageType(108);
    static textOnlyTwoWay = new ViberMessageType(206);
    static textImageButtonTwoWay = new ViberMessageType(208);
    static _ = this.closeEnum();

    constructor(type) {
        super();
        this.type = type;
    }
}

class ViberMessageSourceType extends Enumify {
    static Promotional = new ViberMessageSourceType(1);
    static Transactional = new ViberMessageSourceType(2);
    static _ = this.closeEnum();

    constructor(type) {
        super();
        this.type = type;
    }
}

class ViberMessageStatus extends Enumify {
    static Sent = new ViberMessageStatus(0);
    static Delivered = new ViberMessageStatus(1);
    static Error = new ViberMessageStatus(2);
    static Rejected = new ViberMessageStatus(3);
    static Undelivered = new ViberMessageStatus(4);
    static Pending = new ViberMessageStatus(5);
    static Unknown = new ViberMessageStatus(20);
    static _ = this.closeEnum();

    constructor(status) {
        super();
        this.status = status;
    }

    static parse(status) {
        for (const messageStatus of ViberMessageStatus) {
            if (messageStatus.status == status) {
                return messageStatus;
            }
        }
    }
}

class ViberMessage {
    sender;
    receiver;
    messageType;
    text;
    imageUrl;
    buttonCaption;
    buttonAction;
    sourceType;
    callbackUrl;
    validityPeriod;

    toJSON() {
        return {
            source_addr: this.sender,
            destination_addr: this.receiver,
            message_type: this.messageType === undefined || this.messageType == null ? null : this.messageType.type,
            text: this.text,
            image: this.imageUrl,
            button_caption: this.buttonCaption,
            button_action: this.buttonAction,
            source_type: this.sourceType == undefined || this.sourceType == null ? null : this.sourceType.type,
            callback_url: this.callbackUrl,
            validity_period: this.validityPeriod,
        }
    }
}

class ViberMessageReceipt {
    constructor(messageId, status) {
        this.messageId = messageId;
        this.status = status;
    }

    static fromJSON(json) {
        var data = JSON.parse(json);
        return new ViberMessageReceipt(data.message_id, ViberMessageStatus.parse(data.status));
    }
}

class ViberClient {
    #baseUrl = 'https://web.it-decision.com/v1/api';

    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    sendMessage(message) {
        var url = `${this.#baseUrl}/send-viber`;
        var okResponseFunc = (responseContent) => JSON.parse(responseContent).message_id;

        return this.#makeHttpRequest(url, message, okResponseFunc);
    }

    getMessageStatus(messageId) {
        var request = { message_id: messageId };
        var url = `${this.#baseUrl}/receive-viber`;
        var okResponseFunc = (responseContent) => ViberMessageReceipt.fromJSON(responseContent);

        return this.#makeHttpRequest(url, request, okResponseFunc);
    }

    #makeHttpRequest(url, requestContent, okResponseFunc) {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'POST',
                url: url,
                body: JSON.stringify(requestContent),
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(this.apiKey).toString('base64'),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            };

            request(options, (error, response, body) => {
                if (error) {
                    reject(error)
                    return;
                }

                try {
                    // Process unsuccessful response status codes
                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        var viberError = new ViberError(response.statusMessage, '', 0, response.statusCode);
                        reject(viberError);
                        return;
                    }

                    // If response contains "name", "message", "code" and "status" words, treat it as a ViberError
                    if (body.includes('name') && body.includes('message') && body.includes('code') && body.includes('status')) {
                        reject(ViberError.fromJSON(body));
                        return;
                    }

                    resolve(okResponseFunc(body));
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}

module.exports = {
    ViberError,
    ViberMessageType,
    ViberMessageSourceType,
    ViberMessage,
    ViberMessageStatus,
    ViberClient,
}