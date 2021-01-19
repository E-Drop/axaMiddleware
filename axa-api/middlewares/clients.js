var request = require('request');
var data = [];
var ETag = '';
var authorization = '';

// exports.clientsPromise = 
function clientsPromise(token) {
  return new Promise(
    function (resolve, reject) {
      request({
        url:'https://dare-nodejs-assessment.herokuapp.com/api/clients',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          'User-Agent': 'edropClient',
          'Authorization': token,
          'If-None-Match': ETag,
        },
        json: true,
      }, function(err, res, body) {
        if(err) reject({err: err, status: res.statusCode});
        // console.log(res.statusCode);
        
        if(res.statusCode === 200) {
          ETag = res.headers.etag;
          data = body;
        }
    
        resolve({
          status: res.statusCode,
          data: data,
        })
      })
    }
  );
};

function loginPromise(){
  return new Promise(
    function (resolve, reject) {
      request({
        url:'https://dare-nodejs-assessment.herokuapp.com/api/login',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
          'User-Agent': 'edropClient',
        },
        body: {
          "client_id": "dare",
          "client_secret": "s3cr3t"
        },
        json: true
      }, function(err, res, body) {
        if(err) reject(err);
        
        resolve({
          status: res.statusCode,
          data: body,
        })
      })
    }
  );
};

module.exports = function(req, res, next) {
  const {data, status} = req.contentoPolicies;
  console.log('politicas: ',data);
  clientsPromise(authorization).then(data => {
    req.contentoClients = data;
    if(data.status === 401) {
      loginPromise().then(login => {
        authorization = 'Bearer '+login.data.token;
        clientsPromise(authorization).then(data1 => {
          console.log('DATA1: ', data1);
          req.contentoClients = data1;
          next();
        })
      })
    } else {
      next();
    }
    
  }).catch(err => {
    console.log(err, '**********************************************************');
    next();
  })
}