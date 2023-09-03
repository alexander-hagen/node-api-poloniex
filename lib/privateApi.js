const
  axios = require('axios'),
  util = require('util'),
  crypto = require('crypto');

const
  SIGN=true,
  NOSIGN=false;

var PoloniexPrivate = function(api) {
  this.endPoint = "https://openapi.poloniex.com",
  this.apikey = api.apikey;
  this.secret = api.secret;

  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new PoloniexPrivate(api);
};

PoloniexPrivate.prototype.query = function(options,sign) {

  if(sign) {
    const stamp=Date.now();
    if(!options.data.timestamp && !options.params.timestamp) { options.data["timestamp"]=stamp; };
    var source=JSON.stringify(Object.assign(options.params,options.data));
    var signature = crypto.createHmac('sha256',this.secret).update(source).digest('hex');
    options["params"]["signature"]=signature;
    options["headers"]={ "X-MBX-APIKEY": this.apikey };
  };

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

PoloniexPrivate.prototype.getQuery = function(path,query,sign) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return this.query(options,sign);
};

PoloniexPrivate.prototype.otherQuery = function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return this.query(options,sign);
};

//
//
//

