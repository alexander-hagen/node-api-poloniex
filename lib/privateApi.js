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
        break;
      default:
        source+=(Object.keys(options.data).length==0?"":"requestBody="+JSON.stringify(options.data)+"&")+"signTimestamp="+stamp;
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

PoloniexPrivate.prototype.getQuery = async function(path,query,sign) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
//    data: {}
  };
  return await this.query(options,sign);
};

PoloniexPrivate.prototype.otherQuery = async function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
//    params: {},
    data: query
  };
  return await this.query(options,sign);
};

//
// Accounts
//

PoloniexPrivate.prototype.getAccountInfo = async function() {
  const path="/accounts",options={};
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getAccountBalances = async function(id,options={}) {
  const path="/accounts/"+(id?id+"/":"")+"balances";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getAccountActivity = async function(options={}) {
  const path="/accounts/activity";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.accountTransfer = async function(options) {
  const path="/accounts/transfer";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getAccountTransfers = async function(id,options={}) {
  const path="/accounts/transfer"+(id?"/"+id:"");
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getFees = async function() {
  const path="/feeinfo",options={};
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getInterestHistory = async function(options={}) {
  const path="/accounts/interest/history";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Subaccounts
//

PoloniexPrivate.prototype.getSubaccountInfo = async function() {
  const path="/subaccounts";
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSubaccountBalances = async function(id) {
  var path="/subaccounts/"+(id?id+"/":"")+"balances";
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.subaccountTransfer = async function(options) {
  const path="/subaccounts/transfer";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSubaccountTransfers = async function(id,options={}) {
  const path="/subaccounts/transfer"+(id==undefined?"":"/"+id);
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Wallets
//

PoloniexPrivate.prototype.getDepositAddresses = async function(options={}) {
  const path="/wallets/addresses";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getWalletActivity = async function(options) {
  const path="/wallets/activity";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.createCurrencyAddress = async function(options) {
  const path="/wallets/address";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.withdrawCurrency = async function(options) {
  const path="/wallets/withdraw";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.withdrawCurrencyV2 = async function(options) {
  const path="/v2/wallets/withdraw";
  const result=await this.otherQuery("POST",path,options,SIGN);
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

PoloniexPrivate.prototype.getMargin = async function(options={}) {
  const path="/margin/accountMargin";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getBorrowStatus = async function(options={}) {
  const path="/margin/borrowStatus";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getMaxAmount = async function(options) {
  const path="/margin/maxSize";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Orders
//

PoloniexPrivate.prototype.createSpotOrder = async function(options) {
  const path="/orders";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.createSpotOrders = async function(options) {
  const path="/orders/batch";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.replaceSpotOrder = async function(id,options) {
  const path="/orders/"+id;
  const result=await this.otherQuery("PUT",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSpotOrders = async function(options={}) {
  const path="/orders";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSpotOrder = async function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.cancelSpotOrder = async function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  const result=await this.otherQuery("DELETE",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.cancelSpotOrders = async function(options) {
  const path="/orders/cancelByIds";
  const result=await this.otherQuery("DELETE",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.cancelAllSpotOrders = async function(options={}) {
  const path="/orders";
  const result=await this.otherQuery("DELETE",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.setKillSwitch = async function(options) {
  const path="/orders/killSwitch";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getKillSwitch = async function() {
  const path="/orders/killSwitchStatus";
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Smart Orders
//

PoloniexPrivate.prototype.createSmartOrder = async function(options) {
  const path="/smartorders";
  const result=await this.otherQuery("POST",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.replaceSmartOrder = async function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  const result=await this.otherQuery("PUT",path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSmartOrders = async function(options={}) {
  const path="/smartorders";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSmartOrder = async function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.getQuery(path,{},SIGN);
};

PoloniexPrivate.prototype.cancelSmartOrder = async function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  const result=await this.otherQuery("DELETE",path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.cancelSmartOrders = async function(options) {
  const path="/smartorders/cancelByIds";
  const result=await this.otherQuery("DELETE",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.cancelAllSmartOrders = async function(options={}) {
  const path="/smartorders";
  const result=await this.otherQuery("DELETE",path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Order History
//

PoloniexPrivate.prototype.getOrderHistory = async function(options={}) {
  var path="/orders/history";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getSmartOrderHistory = async function(options={}) {
  var path="/smartorders/history";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

//
// Trades
//

PoloniexPrivate.prototype.getMyTrades = async function(options={}) {
  var path="/trades";
  const result=await this.getQuery(path,options,SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};

PoloniexPrivate.prototype.getOrderTrades = async function(id) {
  var path="/orders/"+id+"/trades";
  const result=await this.getQuery(path,{},SIGN);
  if(result.error) {
    var err=new Error(result.error);
    Object.assign(err,result);
    throw err;
  };
  return result;
};
