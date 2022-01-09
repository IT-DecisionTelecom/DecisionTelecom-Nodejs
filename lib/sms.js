const request = require('request');
const { Enumify } = require('enumify');

class SmsMessageStatus extends Enumify {
    static Unknown = new SmsMessageStatus(0);
    static Delivered = new SmsMessageStatus(2);
    static Expired = new SmsMessageStatus(3);
    static Undeliverable = new SmsMessageStatus(5);
    static Accepted = new SmsMessageStatus(6);
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

class SmsErrorCode extends Enumify {
    static InvalidNumber = new SmsErrorCode(40);
    static IncorrectSender = new SmsErrorCode(41);
    static InvalidMessageId = new SmsErrorCode(42);
    static IncorrectJson = new SmsErrorCode(43);
    static InvalidLoginOrPassword = new SmsErrorCode(44);
    static UserLocked = new SmsErrorCode(45);
    static EmptyText = new SmsErrorCode(46);
    static EmptyLogin = new SmsErrorCode(47);
    static EmptyPassword = new SmsErrorCode(48);
    static NotEnoughMoney = new SmsErrorCode(49);
    static AuthorizationError = new SmsErrorCode(50);
    static InvalidPhoneNumber = new SmsErrorCode(51);
    static _ = this.closeEnum();

    constructor(code) {
        super();
        this.code = code;
    }

    static parse(code) {
        for (const errorCode of SmsErrorCode) {
            if (errorCode.code == code) {
                return errorCode;
            }
        }
    }
}

class SmsError extends Error {
    constructor(errorCode) {
        super('SMS error: ' + errorCode);
        this.errorCode = errorCode;
    }
}

class SmsMessage {
    constructor(receiverPhone, sender, text, delivery) {
        this.receiverPhone = receiverPhone;
        this.sender = sender;
        this.text = text;
        this.delivery = delivery;
    }
}

class SmsClient {
    #baseUrl = 'https://web.it-decision.com/ru/js';
    #errorPropertyName = 'error';
    #messageIdPropertyName = 'msgid';
    #statusPropertyName = 'status';

    constructor(login, password) {
        this.login = login;
        this.password = password;
    }

    sendMessage(message) {
        var dlr = message.delivery ? 1 : 0;
        var url = `${this.#baseUrl}/send?login=${this.login}&password=${this.password}&phone=${message.receiverPhone}&sender=${message.sender}&text=${message.text}&dlr=${dlr}`;
        var okResponseFunc = (responseContent) => parseInt(this.#getValueFromListResponseContent(responseContent, this.#messageIdPropertyName));

        return this.#makeHttpRequest(url, okResponseFunc);
    }

    getMessageStatus(messageId) {
        var url = `${this.#baseUrl}/state?login=${this.login}&password=${this.password}&msgid=${messageId}`;
        var okResponseFunc = (responseContent) => {
            var responseValue = this.#getValueFromListResponseContent(responseContent, this.#statusPropertyName);
            return responseValue === '' ? SmsMessageStatus.Unknown : SmsMessageStatus.parse(parseInt(responseValue));
        }

        return this.#makeHttpRequest(url, okResponseFunc);
    }

    getBalance() {
        var url = `${this.#baseUrl}/balance?login=${this.login}&password=${this.password}`;
        var okResponseFunc = (responseContent) => {
            // Replace symbols to be able to parse response string as json
            // Regexp removes quotation marks ("") around the numbers, so they could be parsed as float
            let regex = new RegExp('"([-+]?[0-9]*.?[0-9]+)"', 'g');
            var replacedContent = responseContent.replace('[', '{').replace(']', '}').replace(regex, '$1');
            return JSON.parse(replacedContent);
        }

        return this.#makeHttpRequest(url, okResponseFunc);
    }

    #makeHttpRequest(url, okResponseFunc) {
        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (error) {
                    reject(error)
                    return;
                }

                try {
                    if (body.startsWith('["' + this.#errorPropertyName)) {
                        var code = parseInt(this.#getValueFromListResponseContent(body, this.#errorPropertyName));
                        var errorCode = SmsErrorCode.parse(code);
                        var smsError = new SmsError(errorCode);
                        reject(smsError);
                    } else {
                        resolve(okResponseFunc(body));
                    }
                }
                catch (error) {
                    reject(error)
                }
            });
        });
    }

    #getValueFromListResponseContent(responseContent, keyPropertyName) {
        var split = responseContent.replace('[', '').replace(']', '').split(',');
        for (var i = 0; i < split.length; i++) {
            split[i] = split[i].replace(/"/g, '');
        }

        if (split[0] !== keyPropertyName) {
            throw new Error(`Invalid response: unknown key '${split[0]}'`);
        }

        return split[1];
    }
}

module.exports = {
    SmsMessage,
    SmsError,
    SmsErrorCode,
    SmsMessageStatus,
    SmsClient
}
