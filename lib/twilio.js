var accountSid = 'AC1457a689a7970a16a1696593dd7a2b6a'; // Your Account SID from www.twilio.com/console
var authToken = '8b6402a8e11fc07c5b7f8cfdff3d7992';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

sendSMS = (message, destination) => {
    return new Promise((resolve, reject) => {
        const targetNumber = destination.substring(1);
        console.log(targetNumber);
        client.messages.create({
            body: message,
            to: `+972${targetNumber}`,  // Text this number
            from: '+972525447862'
        })
        .then((message) => {
            resolve(message);
        }, (err) => reject(err));
    })
    
}

module.exports = {sendSMS};