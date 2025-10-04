const
  axios = require('axios'),
  crypto = require('crypto');

const
  SIGN=true,
  NOSIGN=false;

var PoloniexPrivate = function(api) {
  this.endPoint = "https://api.poloniex.com",
  this.apikey = api.apikey;
  this.secret = api.secret;

  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new PoloniexPrivate(api);
};

PoloniexPrivate.prototype.query = async function(options,sign) {

  if(sign) {
    const stamp=Date.now();
    var source=options.method.toUpperCase()+"\n"+options.url.replace(this.endPoint,'')+"\n";
    switch(options.method) {
      case "GET":
        options.params["signTimestamp"]=stamp;
        source+=Object.keys(options.params)
          .sort()
          .map(key => { return key+"="+encodeURIComponent(options.params[key]); })
          .join("&");
        delete options.params["signTimestamp"];
        break;
      default:
        switch(Object.keys(options.data).length) {
          case 0:
            delete options.data;
            break;
          default:
            source+="requestBody="+JSON.stringify(options.data)+"&";
            break;
        };
        source+="signTimestamp="+stamp;
        break;
    };

    var signature = crypto.createHmac('sha256',this.secret).update(source).digest('base64');

    options["headers"]={
      "key": this.apikey,
      "signature": signature,
      "signTimestamp": stamp
    };

  };

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

PoloniexPrivate.prototype.getQuery = async function(path,query,sign) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return await this.query(options,sign);
};

PoloniexPrivate.prototype.otherQuery = async function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return await this.query(options,sign);
};

//
// Accounts
//

PoloniexPrivate.prototype.getAccountInfo = async function() {
  const path="/accounts",options={};
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getAccountBalances = async function(id,options={}) {
  const path="/accounts/"+(id?id+"/":"")+"balances";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getAccountActivity = async function(options={}) {
  const path="/accounts/activity";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.accountTransfer = async function(options) {
  const path="/accounts/transfer";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getAccountTransfers = async function(id,options={}) {
  const path="/accounts/transfer"+(id?"/"+id:"");
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getFees = async function() {
  const path="/feeinfo",options={};
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getInterestHistory = async function(options={}) {
  const path="/accounts/interest/history";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Subaccounts
//

PoloniexPrivate.prototype.getSubaccountInfo = async function() {
  const path="/subaccounts";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSubaccountBalances = async function(id) {
  var path="/subaccounts/"+(id?id+"/":"")+"balances";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.subaccountTransfer = async function(options) {
  const path="/subaccounts/transfer";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSubaccountTransfers = async function(id,options={}) {
  const path="/subaccounts/transfer"+(id==undefined?"":"/"+id);
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Wallets
//

PoloniexPrivate.prototype.getDepositAddresses = async function(options={}) {
  const path="/wallets/addresses";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getWalletActivity = async function(options) {
  const path="/wallets/activity";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.createCurrencyAddress = async function(options) {
  const path="/wallets/address";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.withdrawCurrency = async function(options) {
  const path="/wallets/withdraw";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.withdrawCurrencyV2 = async function(options) {
  const path="/v2/wallets/withdraw";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Margin
//

PoloniexPrivate.prototype.getMargin = async function(options={}) {
  const path="/margin/accountMargin";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getBorrowStatus = async function(options={}) {
  const path="/margin/borrowStatus";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getMaxAmount = async function(options) {
  const path="/margin/maxSize";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Orders
//

PoloniexPrivate.prototype.createSpotOrder = async function(options) {
  const path="/orders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.createSpotOrders = async function(options) {
  const path="/orders/batch";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.replaceSpotOrder = async function(id,options) {
  const path="/orders/"+id;
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PUT",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSpotOrders = async function(options={}) {
  const path="/orders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSpotOrder = async function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelSpotOrder = async function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelSpotOrders = async function(options) {
  const path="/orders/cancelByIds";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelAllSpotOrders = async function() {
  const path="/orders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.setKillSwitch = async function(options) {
  const path="/orders/killSwitch";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getKillSwitch = async function() {
  const path="/orders/killSwitchStatus";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Smart Orders
//

PoloniexPrivate.prototype.createSmartOrder = async function(options) {
  const path="/smartorders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.replaceSmartOrder = async function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("PUT",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSmartOrders = async function(options={}) {
  const path="/smartorders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSmartOrder = async function(options) {
  const path="/smartorders/"+(options.orderId?options.orderId:"cid:"+options.clientOrderId);
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelSmartOrder = async function(options) {
  const path="/smartorders/"+(options.orderId?options.orderId:"cid:"+options.clientOrderId);
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelSmartOrders = async function(options) {
  const path="/smartorders/cancelByIds";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.cancelAllSmartOrders = async function(options={}) {
  const path="/smartorders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("DELETE",path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Order History
//

PoloniexPrivate.prototype.getOrderHistory = async function(options={}) {
  var path="/orders/history";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getSmartOrderHistory = async function(options={}) {
  var path="/smartorders/history";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

//
// Trades
//

PoloniexPrivate.prototype.getMyTrades = async function(options={}) {
  var path="/trades";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,options,SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};

PoloniexPrivate.prototype.getOrderTrades = async function(id) {
  var path="/orders/"+id+"/trades";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{},SIGN);
    if(output.hasOwnProperty("code")) { reject(output); }
    else { resolve(output); };
  });
};
