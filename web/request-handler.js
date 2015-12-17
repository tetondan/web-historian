var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var httpGet = require('../workers/htmlfetcher')
// require more modules/folders here!
var sendRes = function(res,code, path){
  res.writeHead(code, httpHelpers.headers);
  httpHelpers.serveAssets(res, path, function(data){
    res.end(data);
  });
};

exports.handleRequest = function (req, res) {
    
    if(req.method === 'GET'){
      if(req.url !== '/'){
        var getUrl = archive.paths.archivedSites+req.url;
        archive.isUrlArchived(getUrl, function(exists){
          if(exists){
            sendRes(res,200, getUrl);
          } else {
            res.writeHead(404,httpHelpers.headers);
            res.end();
          }     
        });
      } else {
        sendRes(res, 200, archive.paths.siteAssets+'/index.html');
      }
    }
    
    if(req.method === 'POST'){
      var urlRequest = '';
      req.on('data', function(chunk){
        urlRequest += chunk;
      });
      req.on('end', function(){
        urlRequest = urlRequest.slice(5);
        urlFilepath = archive.paths.archivedSites+'/'+urlRequest;
        archive.isUrlArchived((urlFilepath), function(exists){
          if(exists){
            sendRes(res, 302, urlFilepath);
          } else {
            httpGet.httpGetter();
            sendRes(res, 201, archive.paths.siteAssets+'/loading.html');
            archive.addUrlToList(urlRequest+'\n', function(){
            });
          }
        });
      });
    }
};

// ToDo: Refactor REST methods onto object  - GET/ POST