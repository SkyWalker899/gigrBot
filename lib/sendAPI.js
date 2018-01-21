const Botly = require("botly");
const botly = new Botly({
    accessToken: pageAccessToken, 
    verifyToken: verificationToken, //needed when using express - the verification token you provided when defining the webhook in facebook
    webHookPath: yourWebHookPath, //defaults to "/",
    notificationType: Botly.CONST.REGULAR //already the default (optional),
});
