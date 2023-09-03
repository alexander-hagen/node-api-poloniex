const
  axios = require('axios');

var PoloniexPublic = function() {
  this.endPoint = "https://openapi.poloniex.com";
  this.timeout = 10000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new PoloniexPublic();
};

PoloniexPublic.prototype.query = function(options) {

  return axios(options).then(function(res) {
    return res.data;
  }).catch(function(err) {
    const response={
      code: err.response.status,
      error: err.response.data.msg,
      reason: err.response.data.code,
      data: options
    };
    return response;
  });
};

PoloniexPublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return this.query(options);
};

PoloniexPublic.prototype.otherQuery = function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return this.query(options);
};

//
//
//

