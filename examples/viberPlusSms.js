const { ViberMessageType, ViberMessageSourceType, ViberPlusSmsMessage, ViberError, ViberPlusSmsClient } = require('decisiontelecom');

async function sendTransactionalMessage() {
    try {
        // Create new instance of the viber plus SMS client.
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');

        // Create viber plus SMS message object. This one will be transactional message with message text only.
        var message = new ViberPlusSmsMessage();
        message.sender = '380504444444';
        message.receiver = '380504444444';
        message.text = 'Viber message text';
        message.messageType = ViberMessageType.textOnly;
        message.sourceType = ViberMessageSourceType.Transactional;
        message.validityPeriod = 3600;
        message.smsText = "SMS Text";

        // Call client SendMessage method to send viber plus SMS message.
        var messageId = await viberPlusSmsClient.sendMessage(message);

        // SendMessage method should return Id of the sent Viber plus SMS message.
        console.log('Viber message Id: ' + messageId);
    } catch (error) {
        if (error instanceof ViberError) {
            // ViberError contains specific DecisionTelecom error with details of what went wrong during the operation.
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            // A non-DecisionTelecom error occurred during the operation (like connection error).
            console.log(error);
        }
    }
}

async function sendPromotionalMessage() {
    try {
        // Create new instance of the viber plus SMS client.
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');

        // Create viber plus SMS message object. This one will be promotional message with message text, image and button.
        var message = new ViberPlusSmsMessage();
        message.sender = '380504444444';
        message.receiver = '380504444444';
        message.text = 'Viber message text';
        message.messageType = ViberMessageType.textImageButton;
        message.sourceType = ViberMessageSourceType.Promotional;
        message.imageUrl = 'https://yourdomain.com/images/image.jpg';
        message.buttonCaption = 'Join Us';
        message.buttonAction = 'https://yourdomain.com/join-us';
        message.validityPeriod = 3600;
        message.smsText = "SMS Text";

        // Call client SendMessage method to send viber plus SMS message.
        var messageId = await viberPlusSmsClient.sendMessage(message);

        // SendMessage method should return Id of the sent Viber plus SMS message.
        console.log('Viber message Id: ' + messageId);
    } catch (error) {
        if (error instanceof ViberError) {
            // ViberError contains specific DecisionTelecom error with details of what went wrong during the operation.
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            // A non-DecisionTelecom error occurred during the operation (like connection error).
            console.log(error);
        }
    }
}

async function getMessageStatus() {
    try {
        // Create new instance of the viber plus SMS client.
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');

        // Call client GetMessageStatus method to get viber plus SMS message status.
        var receipt = await viberPlusSmsClient.getMessageStatus(380752);

        // GetMessageStatus method should return status of the sent Viber plus SMS message.
        console.log(`Viber message status: ${receipt.status.status} (${receipt.status})`);
        if (receipt.smsMessageId != undefined && receipt.smsMessageId != null) {
            console.log(`SMS message status: ${receipt.smsMessageStatus.status} (${receipt.smsMessageStatus})`);
        }
    } catch (error) {
        if (error instanceof ViberError) {
            // ViberError contains specific DecisionTelecom error with details of what went wrong during the operation.
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            // A non-DecisionTelecom error occurred during the operation (like connection error).
            console.log(error);
        }
    }
}

sendTransactionalMessage();
sendPromotionalMessage();
getMessageStatus();