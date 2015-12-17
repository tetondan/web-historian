// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');
var http = require('http');







exports.httpGetter = function(url, callback){
  return http.get({
          host: url,
          path: '/'
      }, function(response) {
          var body = '';
          response.on('data', function(d) {
              body += d;
          });
          response.on('end', function() {
              // var parsed = JSON.parse(body);
              callback(body);
          });
      });
}