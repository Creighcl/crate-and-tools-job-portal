const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.database();

exports.propagateNewUsers = functions.auth.user().onCreate((userRecord) => {
  const { email, phoneNumber, uid, displayName } = userRecord;

  db.ref(`/users/${uid}`).set(0);

  return db.ref(`/serviceaccounts/${uid}`).set({
    label: displayName,
    name: displayName,
    email,
    phone: phoneNumber
  });
});
