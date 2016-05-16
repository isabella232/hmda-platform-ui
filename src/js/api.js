var superagent = require('superagent');

function makeResponder(cb){
  return function(err, res){
    if(err) return cb(err);
    var obj = JSON.parse(res.text) || {};
    return cb(obj);
  }
}

function getHandler(url, cb, suffix){
  if(typeof url === 'function'){
    cb = url;
    url = makeUrl(parseLocation(), suffix);
  }

  superagent.get(url).end(makeResponder(cb));
}

function postHandler(url, cb, suffix){
  if(typeof url === 'function'){
    cb = url;
    url = makeUrl(parseLocation, suffix);
  }

  superagent.post(url).end(makeResponder(cb));
}

function makeUrl(obj, suffix){
  var url = '/api'
  if(obj.year) url+= '/years/' + obj.year;
  if(obj.id) url+= '/institutions/' + obj.id;
  if(obj.submission) url+= '/submissions/' + obj.submission;
  if(suffix) url += suffix;
  return url;
}

function parseLocation(){
  var pathParts = location.pathname.split('/');
  return {year: pathParts[1], id:  pathParts[2], submission: pathParts[3]}
 }

module.exports = {

 getInstitutions: function(cb){
   return getHandler('api/institutions', cb);
 },

 getInstitution: function(url, cb){
   return getHandler(url, cb);
 },

 postSubmissions: function(url, cb){
   return postHandler(url, cb, '/submissions');
 },

 getEdits: function(url, cb){
   return getHandler(url, cb, '/edits');
 },

 makeUrl: makeUrl
}
