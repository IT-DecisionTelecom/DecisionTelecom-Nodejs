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

class ViberMessageType extends Enumify {
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

class SmsMessageStatus extends Enumify {
    static Delivered = new SmsMessageStatus(2);
    static Expired = new SmsMessageStatus(3);
    static undeliverable = new SmsMessageStatus(5);
    static _ = this.closeEnum();

    constructor(status) {
        super();
        this.status = status;
    }

    static parse(status) {
        for (const messageStatus of SmsMessageStatus) {
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

class ViberPlusSmsMessage extends ViberMessage {
    smsText;

    toJSON() {
        var message = super.toJSON();
        message.text_sms = this.smsText;
        return message;
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

class ViberPlusSmsMessageReceipt extends ViberMessageReceipt {
    constructor(messageId, status, smsMessageId, smsMessageStatus) {
        super(messageId, status);
        this.smsMessageId = smsMessageId;
        this.smsMessageStatus = smsMessageStatus;
    }

    static fromJSON(json) {
        var data = JSON.parse(json);
        return new ViberPlusSmsMessageReceipt(
            data.message_id, ViberMessageStatus.parse(data.status),
            data.sms_message_id, SmsMessageStatus.parse(data.sms_message_status));
    }
}

class ViberClient {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    sendMessage(message) {
        var url = 'send-viber';
        var okResponseFunc = (responseContent) => JSON.parse(responseContent).message_id;
        return makeHttpRequest(this.apiKey, url, message, okResponseFunc);
    }

    getMessageStatus(messageId) {
        var okResponseFunc = (responseContent) => ViberMessageReceipt.fromJSON(responseContent);
        return getMessageStatus(this.apiKey, messageId, okResponseFunc);
    }
}

class ViberPlusSmsClient extends ViberClient {
    sendMessage(message) {
        return super.sendMessage(message);
    }

    getMessageStatus(messageId) {
        var okResponseFunc = (responseContent) => ViberPlusSmsMessageReceipt.fromJSON(responseContent);
        return getMessageStatus(this.apiKey, messageId, okResponseFunc);
    }
}

function getMessageStatus(apiKey, messageId, okResponseFunc) {
    var url = 'receive-viber'
    var request = { message_id: messageId };
    return makeHttpRequest(apiKey, url, request, okResponseFunc);
}

function makeHttpRequest(apiKey, url, requestContent, okResponseFunc) {
    return new Promise((resolve, reject) => {
        const baseUrl = 'https://web.it-decision.com/v1/api';

        const options = {
            method: 'POST',
            url: `${baseUrl}/${url}`,
            body: JSON.stringify(requestContent),
            headers: {
                'Authorization': 'Basic ' + Buffer.from(apiKey).toString('base64'),
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        };

        request(options, (error, response, body) => {
            if (error) {
                return reject(error)
            }

            try {
                // Process unsuccessful response status codes
                if (response.statusCode < 200 || response.statusCode >= 300) {
                    var viberError = new ViberError(response.statusMessage, '', 0, response.statusCode);
                    return reject(viberError);
                }

                // If response contains "name", "message", "code" and "status" words, treat it as a ViberError
                if (body.includes('name') && body.includes('message') && body.includes('code') && body.includes('status')) {
                    return reject(ViberError.fromJSON(body));
                }

                return resolve(okResponseFunc(body));
            }
            catch (error) {
                return reject(error);
            }
        });
    });
}

module.exports = {
    ViberError,
    ViberMessageType,
    ViberMessageSourceType,
    ViberMessage,
    ViberMessageStatus,
    SmsMessageStatus,
    ViberMessageReceipt,
    ViberPlusSmsMessageReceipt,
    ViberPlusSmsMessage,
    ViberClient,
    ViberPlusSmsClient
}