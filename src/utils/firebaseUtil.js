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

function remove(path, callback) {
  CustomRebase.remove(path, callback);
}

function fetch(path, callback) {
  const options = {
    then: (data) => {
      callback(null, data);
    },
    onFailure: (err) => {
      callback(err);
    }
  };
  CustomRebase.fetch(path, options);
}

function post (path, data, callback) {
  const options = {
    data,
    then: (err) => {
      callback(err);
    },
  };
  CustomRebase.post(path, options);
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

function removeQuote(quoteId, callback) {
  const path = sprintf('quotes/%s', quoteId);
  remove(path, callback);
}

function fetchQuote(quoteId, callback) {
  const path = sprintf('quotes/%s', quoteId);
  fetch(path, callback);
}

function fetchTags(callback) {
  const options = {
    asArray: true,
    then: (data) => {
      callback(null, data);
    },
    onFailure: (err) => {
      callback(err);
    }
  };
  CustomRebase.fetch('tags', options);
}

function fetchAuthors(callback) {
  const options = {
    asArray: true,
    then: (data) => {
      callback(null, data);
    },
    onFailure: (err) => {
      callback(err);
    }
  };
  CustomRebase.fetch('authors', options);
}

function updateQuote(quote, callback) {
  const path = sprintf('quotes/%s', quote.id);
  update(path, quote, callback)
}

function setTags(tags, callback) {
  post('tags', tags, callback)
}

function setConfigs(path, config, callback) {
  update(path, config, callback)
}

module.exports = {
  writeQuotes,
  writeAuthors,
  setConfigs,
  removeQuote,
  fetchQuote,
  fetchTags,
  fetchAuthors,
  updateQuote,
  setTags
}
