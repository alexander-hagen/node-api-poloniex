const
  axios = require('axios');

var PoloniexPublic = function() {
  this.endPoint = "https://api.poloniex.com";
  this.timeout = 10000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new PoloniexPublic();
};

PoloniexPublic.prototype.query = async function(options) {

  return await axios(options)
    .then(function(res) { return res.data; })
    .catch(function(err) {
      var response;
      if(err.hasOwnProperty("response")) {
        response={
          code: err.response.status,
          error: err.response.data.message,
          reason: err.response.data.code,
          data: options
        };
      } else {
        response={
          code: err.code,
          data: options
        };
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
  return await this.query(options);
};

PoloniexPublic.prototype.otherQuery = async function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return await this.query(options);
};

//
// Reference Data
//

PoloniexPublic.prototype.getSymbols = async function(symbol) {
  const path="/markets"+(symbol?"/"+symbol:"");
  return this.getQuery(path,{});
};

PoloniexPublic.prototype.getCurrencies = async function(currency,options={}) {
  const path="/currencies"+(currency?"/"+currency:"");
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getCurrenciesV2 = async function(currency) {
  const path="/v2/currencies"+(currency?"/"+currency:"");
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getServerTime = async function() {
  const path="/timestamp";
  return this.getQuery(path,{});
};

//
// Market Data
//

PoloniexPublic.prototype.getPrices = async function(symbol) {
  const path="/markets/"+(symbol==undefined?"":symbol+"/")+"price";
  return this.getQuery(path,{});
};

PoloniexPublic.prototype.getMarkPrice = async function(symbol) {
  const path="/markets/"+(symbol==undefined?"":symbol+"/")+"markPrice";
  return this.getQuery(path,{});
};

PoloniexPublic.prototype.getMarkPrice = async function(symbol) {
  const path="/markets/"+symbol+"/markPriceComponents";
  return this.getQuery(path,{});
};

PoloniexPublic.prototype.getOrderbook = async function(symbol,options) {
  const path="/markets/"+symbol+"/orderBook";
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getCandles = async function(symbol,options) {
  const path="/markets/"+symbol+"/candles";
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getTrades = async function(symbol,options) {
  const path="/markets/"+symbol+"/trades";
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getTicker24h = async function(symbol,options) {
  const path="/markets/"+(symbol==undefined?"":symbol+"/")+"/ticker24h";
  return this.getQuery(path,options);
};

//
// Margin
//

PoloniexPublic.prototype.getCollateralInfo = async function(currency,options) {
  const path="/markets/"+(currency==undefined?"":currency+"/")+"/collateralInfo";
  return this.getQuery(path,options);
};

PoloniexPublic.prototype.getBorrowRatesInfo = async function() {
  const path="/markets/borrowRatesInfo";
  return this.getQuery(path,{});
};
