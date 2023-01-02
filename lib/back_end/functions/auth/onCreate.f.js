const functions = require("firebase-functions");
const admin = require("firebase-admin");

exports.sayHelloToNewUser = functions.auth.user().onCreate((user) => {
    console.log("Hello!");
    return functions.logger.log("Success");
});
