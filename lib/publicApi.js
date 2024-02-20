const
  axios = require('axios');

var PoloniexPublic = function() {
  this.endPoint = "https://api.poloniex.com";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new PoloniexPublic();
};

PoloniexPublic.prototype.query = async function(options) {

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response;
    if(err.hasOwnProperty("response")) {
      response={
        code: err.response.status,
        error: err.response.data.error,
//        reason: err.response.data.error.code,
        data: options
      };
    } else {
      response={
        code: err.code,
        error: "Unknown error occured",
        data: options
      };
    };
    return response;
  };

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

PoloniexPublic.prototype.getCurrency = async function(currency,options={}) {
  const path="/currencies"+(currency?"/"+currency:"");
  const result=await this.getQuery(path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getCurrencyV2 = async function(currency) {
  const path="/v2/currencies"+(currency?"/"+currency:"");
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getSymbol = async function(symbol) {
  const path="/markets"+(symbol?"/"+symbol:"");
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getServerTime = async function() {
  const path="/timestamp";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Market Data
//

PoloniexPublic.prototype.getPrices = async function(symbol) {
  const path="/markets/"+(symbol==undefined?"":symbol+"/")+"price";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getMarkPrice = async function(symbol) {
  const path="/markets/"+(symbol?symbol+"/":"")+"markPrice";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getMarkPriceComponents = async function(symbol) {
  const path="/markets/"+symbol+"/markPriceComponents";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getOrderBook = async function(symbol,options={}) {
  const path="/markets/"+symbol+"/orderBook";
  const result=await this.getQuery(path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getCandles = async function(symbol,options) {
  const path="/markets/"+symbol+"/candles";
  const result=await this.getQuery(path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getTrades = async function(symbol,options={}) {
  const path="/markets/"+symbol+"/trades";
  const result=await this.getQuery(path,options);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getTicker24h = async function(symbol) {
  const path="/markets/"+(symbol?symbol+"/":"")+"ticker24h";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Margin
//

PoloniexPublic.prototype.getCollateralInfo = async function(currency) {
  const path="/markets/"+(currency?currency+"/":"")+"collateralInfo";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPublic.prototype.getBorrowRatesInfo = async function() {
  const path="/markets/borrowRatesInfo";
  const result=await this.getQuery(path,{});
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};
