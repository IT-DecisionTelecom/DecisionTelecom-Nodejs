const { SmsClient, SmsMessage, SmsError, SmsErrorCode } = require('../lib/sms.js');

async function smsSendMessage() {
    var message = new SmsMessage('380505555555', '380504444444', 'Text message', true);

    try {
        var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');
        var messageId = await smsClient.sendMessage(message);
        console.log('Message Id: ', messageId);
    } catch(error) {
        if (error instanceof SmsError) {
            console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);
            
            switch (error.errorCode) {
                case sms.SmsErrorCode.AuthorizationError:
                    console.log('Authorization error');
            }
        } else {
            console.log(error);
        }
    }
}

function smsGetMessageStatus() {
    var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');

    smsClient.getMessageStatus(31885463).then(
        status => console.log('Message status: ' + status),
        error => {
            if (error instanceof SmsError) {
                console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

                switch (error.errorCode) {
                    case SmsErrorCode.AuthorizationError:
                        console.log('Authorization error');
                }
            } else {
                console.log(error);
            }
        });
}

function smsGetBalance() {
    var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');

    smsClient.getBalance().then(
        balance => console.log(`Balance: ${balance.balance}, Credit: ${balance.credit}, Currency: ${balance.currency}`),
        error => {
            if (error instanceof sms.SmsError) {
                console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

                switch (error.errorCode) {
                    case SmsErrorCode.AuthorizationError:
                        console.log('Authorization error');
                }
            } else {
                console.log(error);
            }
        });
}

smsSendMessage();
smsGetMessageStatus();
smsGetBalance();