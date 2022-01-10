const { ViberMessageType, ViberMessageSourceType, ViberMessage, ViberError, ViberClient } = require('../lib/viber.js');

async function sendTransactionalMessage() {
    var message = new ViberMessage();
    message.sender = '380504444444';
    message.receiver = '380504444444';
    message.text = 'Viber message text';
    message.messageType = ViberMessageType.textOnly;
    message.sourceType = ViberMessageSourceType.Transactional;
    message.validityPeriod = 3600;

    try {
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');
        var messageId = await viberClient.sendMessage(message);
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
    var message = new ViberMessage();
    message.sender = '380504444444';
    message.receiver = '380504444444';
    message.text = 'Viber message text';
    message.messageType = ViberMessageType.textImageButton;
    message.sourceType = ViberMessageSourceType.Promotional;
    message.imageUrl = 'https://yourdomain.com/images/image.jpg';
    message.buttonCaption = 'Join Us';
    message.buttonAction = 'https://yourdomain.com/join-us';
    message.validityPeriod = 3600;

    try {
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');
        var messageId = await viberClient.sendMessage(message);
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
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');
        var receipt = await viberClient.getMessageStatus(380752);
        console.log(`Viber message status: ${receipt.status.status} (${receipt.status})`);
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