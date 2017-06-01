import * as _ from 'lodash';
import { sprintf } from 'sprintf-js';

import CustomRebase from '../common/CustomRebase'
const dummyData from '../test/test.json'

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
  var pushKey = CustomRebase.push('quotes').key();
  const path = sprintf('quotes/%s', pushKey)
  quote.id = pushKey;
  update(path, quote, callback)
}

export function writeQuotes(quotes, callback) {
  _.map(dummyData, (quote) => {
    writeQuote(quote, callback)
  })
}
