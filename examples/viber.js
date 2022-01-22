const { ViberMessageType, ViberMessageSourceType, ViberMessage, ViberError, ViberClient } = require('decisiontelecom');

async function sendTransactionalMessage() {
    try {
        // Create new instance of the viber client.
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');

        // Create viber message object. This one will be transactional message with message text only.
        var message = new ViberMessage();
        message.sender = '380504444444';
        message.receiver = '380504444444';
        message.text = 'Viber message text';
        message.messageType = ViberMessageType.textOnly;
        message.sourceType = ViberMessageSourceType.Transactional;
        message.validityPeriod = 3600;

        // Call client SendMessage method to send viber message.
        var messageId = await viberClient.sendMessage(message);

        // SendMessage method should return Id of the sent Viber message.
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
        // Create new instance of the viber client.
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');

        // Create viber message object. This one will be promotional message with message text, image and button.
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

        // Call client SendMessage method to send viber message.
        var messageId = await viberClient.sendMessage(message);

        // SendMessage method should return Id of the sent Viber message.
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
        // Create new instance of the viber client.
        var viberClient = new ViberClient('<YOUR_ACCESS_KEY>');

        // Call client GetMessageStatus method to get viber message status.
        var receipt = await viberClient.getMessageStatus(380752);

        // GetMessageStatus method should return status of the sent Viber message.
        console.log(`Viber message status: ${receipt.status.status} (${receipt.status})`);
    } catch (error) {
        if (error instanceof ViberError) {
            // ViberError contains specific DecisionTelecom error with details of what went wrong during the operation.
            console.log('Error while getting Viber message status.')
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