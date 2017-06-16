var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var CustomRebase = require('../common/CustomRebase').CustomRebase

function update (path, data, callback) {
  const options = {
    data,
    then: (err) => {
      callback(err);
    },
  };
  CustomRebase.update(path, options);
}

function push(path, data, callback) {
  const options = {
    data,
    then: (err) => {
      callback(err);
    },
  };
  CustomRebase.push(path, options);
}

function writeQuote(quote, callback) {
  var pushKey = CustomRebase.initializedApp.database().ref('quotes').push().key;
  const path = sprintf('quotes/%s', pushKey);
  quote.id = pushKey;
  update(path, quote, callback)
}

function writeQuotes(quotes, callback) {
  _.map(quotes, (quote) => {
    writeQuote(quote, callback)
  })
}

function writeAuthor(author, callback) {
  var pushKey = CustomRebase.initializedApp.database().ref('authors').push().key;
  const path = sprintf('authors/%s', pushKey);
  author.id = pushKey;
  update(path, author, callback)
}

function writeAuthors(authors, callback) {
  _.map(authors, (author) => {
    writeAuthor(author, callback)
  })
}

function setConfigs(path, config, callback) {
  update(path, config, callback)
}

module.exports = {
  writeQuotes: writeQuotes,
  writeAuthors: writeAuthors,
  setConfigs: setConfigs
}
