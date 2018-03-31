var Rebase = require('re-base');
var firebase = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');

var app = firebase.initializeApp({
      apiKey: "AIzaSyADqLZpW3HIaPdg0zKJ3CnVD2cfPVa_5NQ",
      authDomain: "qmate-aea6e.firebaseio.com",
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: "https://qmate-aea6e.firebaseio.com/",
      storageBucket: "gs://qmate-aea6e.appspot.com"
});

var CustomRebaseAPI = Rebase.createClass(app.database());

module.exports = {
  CustomRebaseAPI: CustomRebaseAPI
};
