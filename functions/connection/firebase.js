var admin = require("firebase-admin");

var serviceAccount = require("../config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebase = admin.firestore();

module.exports = {
    firebase
}