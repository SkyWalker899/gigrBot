
var admin = require("firebase-admin");
var serviceAccount = require("../keys.json");

const FireApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://gigzr-f2a9e.firebaseio.com"
});



module.exports.FireDB = FireApp.database();