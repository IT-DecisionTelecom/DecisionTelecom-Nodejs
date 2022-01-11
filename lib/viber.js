const request = require('request');
const { Enumify } = require('enumify');

/**
 * Represents Viber error
 */
class ViberError extends Error {
    /**
     * @param  {string} name Error name
     * @param  {string} message Error message
     * @param  {number} code Error code
     * @param  {number} status Error status
     */
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

/**
 * Represents Viber message type
 */
class ViberMessageType extends Enumify {
    static textOnly = new ViberMessageType(106);
    static textImageButton = new ViberMessageType(108);
    static textOnlyTwoWay = new ViberMessageType(206);
    static textImageButtonTwoWay = new ViberMessageType(208);
    static _ = this.closeEnum();

    /**
     * @param  {number} type Viber message type code
     */
    constructor(type) {
        super();
        this.type = type;
    }
}

/**
 * Represents Viber message source type
 */
class ViberMessageSourceType extends Enumify {
    static Promotional = new ViberMessageSourceType(1);
    static Transactional = new ViberMessageSourceType(2);
    static _ = this.closeEnum();

    /**
     * @param  {number} type Viber message source type code
     */
    constructor(type) {
        super();
        this.type = type;
    }
}

/**
 * Represents Viber message status
 */
class ViberMessageStatus extends Enumify {
    static Sent = new ViberMessageStatus(0);
    static Delivered = new ViberMessageStatus(1);
    static Error = new ViberMessageStatus(2);
    static Rejected = new ViberMessageStatus(3);
    static Undelivered = new ViberMessageStatus(4);
    static Pending = new ViberMessageStatus(5);
    static Unknown = new ViberMessageStatus(20);
    static _ = this.closeEnum();

    /**
     * @param  {number} status Viber message status code
     */
    constructor(status) {
        super();
        this.status = status;
    }

    /**
     * @param  {number} status Viber message status code
     */
    static parse(status) {
        for (const messageStatus of ViberMessageStatus) {
            if (messageStatus.status == status) {
                return messageStatus;
            }
        }
    }
}

/**
 * Represents SMS message status
 */
class SmsMessageStatus extends Enumify {
    static Delivered = new SmsMessageStatus(2);
    static Expired = new SmsMessageStatus(3);
    static undeliverable = new SmsMessageStatus(5);
    static _ = this.closeEnum();

    /**
     * @param  {number} status SMS message status code
     */
    constructor(status) {
        super();
        this.status = status;
    }

    /**
     * @param  {number} status SMS message status code
     */
    static parse(status) {
        for (const messageStatus of SmsMessageStatus) {
            if (messageStatus.status == status) {
                return messageStatus;
            }
        }
    }
}

/**
 * Represents Viber message
 */
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

/**
 * Represents Viber plus SMS message
 */
class ViberPlusSmsMessage extends ViberMessage {
    smsText;

    toJSON() {
        var message = super.toJSON();
        message.text_sms = this.smsText;
        return message;
    }
}

/**
 * Represents Viber message receipt (Id and status of the particular Viber message)
 */
class ViberMessageReceipt {
    
    /**
     * @param  {number} messageId Viber message Id
     * @param  {ViberMessageStatus} status Viber message status
     */
    constructor(messageId, status) {
        this.messageId = messageId;
        this.status = status;
    }
    /**
     * @param  {string} json JSON representation of the ViberMessageReceipt object
     */
    static fromJSON(json) {
        var data = JSON.parse(json);
        return new ViberMessageReceipt(data.message_id, ViberMessageStatus.parse(data.status));
    }
}

/**
 * Represents Viber plus SMS message receipt (Id and status of the particular Viber and SMS message)
 */
class ViberPlusSmsMessageReceipt extends ViberMessageReceipt {
    
    /**
     * @param  {number} messageId Viber message Id
     * @param  {ViberMessageStatus} status Viber message status
     * @param  {number} smsMessageId SMS message Id
     * @param  {SmsMessageStatus} smsMessageStatus SMS message status
     */
    constructor(messageId, status, smsMessageId, smsMessageStatus) {
        super(messageId, status);
        this.smsMessageId = smsMessageId;
        this.smsMessageStatus = smsMessageStatus;
    }

    /**
     * @param  {string} json JSON representation of the ViberPlusSmsMessageReceipt object
     */
    static fromJSON(json) {
        var data = JSON.parse(json);
        return new ViberPlusSmsMessageReceipt(
            data.message_id, ViberMessageStatus.parse(data.status),
            data.sms_message_id, SmsMessageStatus.parse(data.sms_message_status));
    }
}

/**
 * Client to work with Viber messages
 */
class ViberClient {

    /**
     * @param  {string} apiKey User access key
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * Sends Viber message
     * @param  {ViberMessage} message Viber message to send
     * @returns {Promise<number>} Id of the sent Viber message
     * @throws {ViberError} If specific Viber error occurred
     */
    sendMessage(message) {
        var url = 'send-viber';
        var okResponseFunc = (responseContent) => JSON.parse(responseContent).message_id;
        return makeHttpRequest(this.apiKey, url, message, okResponseFunc);
    }

    /**
     * Returns Viber message status
     * @param  {number} messageId Id of the Viber message (sent in the last 5 days)
     * @returns {Promise<ViberMessageReceipt>} Viber message receipt object
     * @throws {ViberError} If specific Viber error occurred
     */
    getMessageStatus(messageId) {
        var okResponseFunc = (responseContent) => ViberMessageReceipt.fromJSON(responseContent);
        return getMessageStatus(this.apiKey, messageId, okResponseFunc);
    }
}

class ViberPlusSmsClient extends ViberClient {
    /**
     * Sends Viber plus SMS message
     * @param  {ViberPlusSmsMessage} message Viber plus SMS message to send
     * @returns {Promise<number>} Id of the sent Viber plus SMS message
     * @throws {ViberError} If specific Viber error occurred
     */
    sendMessage(message) {
        return super.sendMessage(message);
    }

    /**
     * Returns Viber plus message status
     * @param  {number} messageId Id of the Viber message (sent in the last 5 days)
     * @returns {Promise<ViberPlusSmsMessageReceipt>} Viber plus SMS message receipt object
     * @throws {ViberError} If specific Viber error occurred
     */
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