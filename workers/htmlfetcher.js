// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var _ = require('underscore');


exports.httpGetter = function(){
  archive.readListOfUrls(function(array){
    _.each(array, function(item){
      var newUrl = archive.paths.archivedSites+'/'+item
      archive.isUrlArchived(item, function(exists){
        if(!exists && item !== ''){
          archive.downloadUrls(item, newUrl);
        }
      });
    });
  });
};
