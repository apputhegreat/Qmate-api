var Rebase = require('re-base');
var firebase = require('firebase');

var app = firebase.initializeApp({
      apiKey: "AIzaSyADqLZpW3HIaPdg0zKJ3CnVD2cfPVa_5NQ",
      authDomain: "qmate-aea6e.firebaseio.com",
      databaseURL: "https://qmate-aea6e.firebaseio.com/",
      storageBucket: "gs://qmate-aea6e.appspot.com"
});

var CustomRebase = Rebase.createClass(app.database());

//export default CustomRebase;
module.exports = {
  CustomRebase: CustomRebase
};
