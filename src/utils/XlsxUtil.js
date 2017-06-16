var async = require('async');
var xlsx = require('xlsx');
var fs = require('fs');
var _ = require('lodash');
var sprintf = require('sprintf-js').sprintf;

var firebaseUtil = require('./firebaseUtil')

var CustomRebase = require('../common/CustomRebase').CustomRebase

var getQuote = (quote) => {
  var quote = {}
  var pushKey = CustomRebase.initializedApp.database().ref('quotes').push().key;
  quote[pushKey] = {
    text,
    author,
    tags
  }
  return quote
}

var getRow = (row, rowId, property, value) => {
  console.log('getRow-->', row);
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

var setQuotesFromXlsx = () => {
 var authorsDB = []
 var authorsNotInDB = []
 var getQuotes = (authorsInDB, callback) => {
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
          quotes[rowId] = getRow(quotes[rowId], rowId, 'text', QuotesSheet[key].v.trim())
         break;
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
          var tagList = QuotesSheet[key].v.trim().split(',');
          quotes[rowId] = getRow(quotes[rowId], rowId, 'tags', tagList)
        break;
     }
   }
   firebaseUtil.writeQuotes(quotes, callback);
   //CustomRebase.initializedApp.database().ref('tags').set(["Motivational", "Inspirational", "Love", "Humor", "Wisdom", "Happy", "God", "Mind", "Life", "Philosophy"])
 }

 //fs.writeFile('quotes.json', JSON.stringify(quotes), 'utf8', callback);
 async.waterfall([getAllAuthors, getQuotes], (err, data) => {
   if (err) {
     console.log(err);
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

module.exports = {
  setQuotesFromXlsx: setQuotesFromXlsx,
  getAllAuthors: getAllAuthors,
}
