const { ViberMessageType, ViberMessageSourceType, ViberPlusSmsMessage, ViberError, ViberPlusSmsClient } = require('../lib/viber.js');

async function sendTransactionalMessage() {
    var message = new ViberPlusSmsMessage();
    message.sender = '380504444444';
    message.receiver = '380504444444';
    message.text = 'Viber message text';
    message.messageType = ViberMessageType.textOnly;
    message.sourceType = ViberMessageSourceType.Transactional;
    message.validityPeriod = 3600;
    message.smsText = "SMS Text";

    try {
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');
        var messageId = await viberPlusSmsClient.sendMessage(message);
        console.log('Viber message Id: ' + messageId);
    } catch (error) {
        if (error instanceof ViberError) {
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            console.log(error);
        }
    }
}

async function sendPromotionalMessage() {
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

    try {
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');
        var messageId = await viberPlusSmsClient.sendMessage(message);
        console.log('Viber message Id: ' + messageId);
    } catch (error) {
        if (error instanceof ViberError) {
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            console.log(error);
        }
    }
}

async function getMessageStatus() {
    try {
        var viberPlusSmsClient = new ViberPlusSmsClient('<YOUR_ACCESS_KEY>');
        var receipt = await viberPlusSmsClient.getMessageStatus(380752);
        console.log(`Viber message status: ${receipt.status.status} (${receipt.status})`);
        if (receipt.smsMessageId != undefined && receipt.smsMessageId != null) {
            console.log(`SMS message status: ${receipt.smsMessageStatus.status} (${receipt.smsMessageStatus})`);
        }
    } catch (error) {
        if (error instanceof ViberError) {
            console.log('Error while sending Viber message.')
            console.log(`Error name: ${error.name}`);
            console.log(`Error message: ${error.message}`);
            console.log(`Error code: ${error.code}`);
            console.log(`Error status: ${error.status}`);
        } else {
            console.log(error);
        }
    }
}

sendTransactionalMessage();
sendPromotionalMessage();
getMessageStatus();