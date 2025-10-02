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
        error: err.response.data.message,
        reason: err.response.data.code,
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
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getCurrencyV2 = async function(currency) {
  const path="/v2/currencies"+(currency?"/"+currency:"");
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getSymbol = async function(symbol) {
  const path="/markets"+(symbol?"/"+symbol:"");
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getServerTime = async function() {
  const path="/timestamp";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Market Data
//

PoloniexPublic.prototype.getPrices = async function(symbol) {
  const path="/markets/"+(symbol==undefined?"":symbol+"/")+"price";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getMarkPrice = async function(symbol) {
  const path="/markets/"+(symbol?symbol+"/":"")+"markPrice";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getMarkPriceComponents = async function(symbol) {
  const path="/markets/"+symbol+"/markPriceComponents";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getOrderBook = async function(symbol,options={}) {
  const path="/markets/"+symbol+"/orderBook";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getCandles = async function(symbol,options) {
  const path="/markets/"+symbol+"/candles";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getTrades = async function(symbol,options={}) {
  const path="/markets/"+symbol+"/trades";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getTicker24h = async function(symbol) {
  const path="/markets/"+(symbol?symbol+"/":"")+"ticker24h";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Margin
//

PoloniexPublic.prototype.getCollateralInfo = async function(currency) {
  const path="/markets/"+(currency?currency+"/":"")+"collateralInfo";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPublic.prototype.getBorrowRatesInfo = async function() {
  const path="/markets/borrowRatesInfo";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};
