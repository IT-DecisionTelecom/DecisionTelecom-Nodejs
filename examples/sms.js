const { SmsClient, SmsMessage, SmsError, SmsErrorCode } = require('decisiontelecom');

async function smsSendMessage() {
    try {
        // Create new instance of the SMS client.
        var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');

        // Create SMS message object
        var message = new SmsMessage('380505555555', '380504444444', 'Text message', true);

        // Call client SendMessage method to send SMS message.
        var messageId = await smsClient.sendMessage(message);

        // SendMessage method should return Id of the sent SMS message.
        console.log('Message Id: ', messageId);
    } catch (error) {
        if (error instanceof SmsError) {
            // SmsError contains specific DecisionTelecom error with the code of what went wrong during the operation.
            console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

            // It's also possible to use switch statement to better handle specific error code.
            switch (error.errorCode) {
                case sms.SmsErrorCode.AuthorizationError:
                    console.log('Authorization error');
                //...
            }
        } else {
            // A non-DecisionTelecom error occurred during the operation (like connection error).
            console.log(error);
        }
    }
}

function smsGetMessageStatus() {
    // Create new instance of the SMS client.
    var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');

    // Call client GetMessageStatus method to get SMS message status.
    smsClient.getMessageStatus(31885463).then(
        // GetMessageStatus method should return status of the sent SMS message.
        status => console.log('Message status: ' + status),
        error => {
            if (error instanceof SmsError) {
                // SmsError contains specific DecisionTelecom error with the code of what went wrong during the operation.
                console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

                // It's also possible to use switch statement to better handle specific error code.
                switch (error.errorCode) {
                    case sms.SmsErrorCode.AuthorizationError:
                        console.log('Authorization error');
                    //...
                }
            } else {
                // A non-DecisionTelecom error occurred during the operation (like connection error).
                console.log(error);
            }
        });
}

function smsGetBalance() {
    // Create new instance of the SMS client.
    var smsClient = new SmsClient('<YOUR_LOGIN>', '<YOUR_PASSWORD>');

    // Call client GetBalance method to get SMS balance information.
    smsClient.getBalance().then(
        // GetBalance method should return SMS balance information.
        balance => console.log(`Balance: ${balance.balance}, Credit: ${balance.credit}, Currency: ${balance.currency}`),
        error => {
            if (error instanceof sms.SmsError) {
                // SmsError contains specific DecisionTelecom error with the code of what went wrong during the operation.
                console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

                // It's also possible to use switch statement to better handle specific error code.
                switch (error.errorCode) {
                    case sms.SmsErrorCode.AuthorizationError:
                        console.log('Authorization error');
                    //...
                }
            } else {
                // A non-DecisionTelecom error occurred during the operation (like connection error).
                console.log(error);
            }
        });

    try {
        // Call client GetBalance method to get SMS balance information.
        var balance = await smsClient.getBalance();

        // GetBalance method should return SMS balance information.
        console.log(`Balance: ${balance.balance}, Credit: ${balance.credit}, Currency: ${balance.currency}`);
    } catch (error) {
        if (error instanceof sms.SmsError) {
            // SmsError contains specific DecisionTelecom error with the code of what went wrong during the operation.
            console.log(`SMS error code: ${error.errorCode.code} (${error.errorCode})`);

            // It's also possible to use switch statement to better handle specific error code.
            switch (error.errorCode) {
                case sms.SmsErrorCode.AuthorizationError:
                    console.log('Authorization error');
                //...
            }
        } else {
            // A non-DecisionTelecom error occurred during the operation (like connection error).
            console.log(error);
        }
    }
}

smsSendMessage();
smsGetMessageStatus();
smsGetBalance();