var async = require('async');
var xlsx = require('xlsx');
var fs = require('fs');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var firebaseUtil = require('./firebaseUtil')

var CustomRebase = require('../common/CustomRebase').CustomRebase

var getRow = (row, rowId, property, value) => {
  if (!row) {
    row = {id: rowId }
    row[property] = value
  } else {
    row[property] = value
  }
  return row
}

var getAuthorByName = (authors, name) => {
  var author = _.find(authors, (author) => {
   return author.name.toUpperCase() == name.toUpperCase()
  })
  return author
}

var getQuoteByText = (quotes, text) => {
  var quoteObj = _.find(quotes, (quote) => {
   return quote.text.trim().toUpperCase() == text.trim().toUpperCase()
  })
  return quoteObj
}

function getUniqQuotes(quotesInDB, newQuotes) {
  newQuotes = _.filter(newQuotes, (value, key) => {
    if (!value.text || !value.tags) {
      return false;
    }
    var quoteObj = getQuoteByText(quotesInDB, value.text)
    if (quoteObj) {
      return false
    }
    return true;
  })
  return newQuotes;
}

var setQuotesFromXlsx = () => {
 var authorsDB = []
 var authorsNotInDB = []
 var readQuotes = (quotesInDB, authorsInDB, callback) => {
   authorsDB = authorsInDB
   var workbook = xlsx.readFile(__dirname +"/../../configs/Quotes.xlsx");
   var QuotesSheet = workbook.Sheets["Quotes"]
   var quotes = {}
   for(var key in QuotesSheet) {
     if (!QuotesSheet.hasOwnProperty(key) || key[0] == "!") continue
     var rowId = key.substring(1)
     if(rowId==1) continue
     switch (key[0]) {
       case "A":
          if (QuotesSheet[key].v.trim()) {
            quotes[rowId] = getRow(quotes[rowId], rowId, 'text', QuotesSheet[key].v.trim())
            break;
          } else {
            continue;
          }
       case "B":
          quotes[rowId] = getRow(quotes[rowId], rowId, 'author', QuotesSheet[key].v.trim())
          var authorObj = getAuthorByName(authorsDB, QuotesSheet[key].v.trim())
           if(authorObj) {
              quotes[rowId] = getRow(quotes[rowId], rowId, 'authorId', authorObj.id)
           } else {
            //  if(!_.includes(authorsNotInDB, QuotesSheet[key].v.trim())) {
            //    authorsNotInDB.push(QuotesSheet[key].v.trim())
            //  }
            var pushKey = CustomRebase.initializedApp.database().ref('authors').push().key
            quotes[rowId] = getRow(quotes[rowId], rowId, 'authorId', pushKey)
            var path = sprintf('authors/%s', pushKey);
            var data = {
              id: pushKey,
              name: QuotesSheet[key].v.trim()
            }
            authorsDB.push(data);
            var options = {
              data,
              then: (err) => {
                if (err) {
                  callback(err);
                  return ;
                }
              },
            };
            CustomRebase.update(path, options);
           }
        break;
       case "C":
          if (QuotesSheet[key].v.trim()) {
            var tagList = QuotesSheet[key].v.trim().split(',');
            quotes[rowId] = getRow(quotes[rowId], rowId, 'tags', tagList)
            break;
          } else {
            continue
          }
     }
   }
   var uniqQuotes = getUniqQuotes(quotesInDB, quotes);
   firebaseUtil.writeQuotes(uniqQuotes, callback);
 }

 //fs.writeFile('quotes.json', JSON.stringify(quotes), 'utf8', callback);
 async.waterfall([
   getAllAuthors,
   getAllQuotes,
   readQuotes
 ], (err, data) => {
   if (err) {
     console.log('err->', err);
   }
 })
}

var getAllAuthors = (callback) => {
  CustomRebase.fetch('authors', {
  context: this,
  asArray: true,
  then(data){
    callback(null, data)
  }
})
}

var getAllQuotes = (authors, callback) => {
  CustomRebase.fetch('quotes', {
  context: this,
  asArray: true,
  then(data){
    callback(null, data, authors)
  }
})
}

module.exports = {
  setQuotesFromXlsx: setQuotesFromXlsx,
  getAllAuthors: getAllAuthors,
  getAllQuotes: getAllQuotes
}
