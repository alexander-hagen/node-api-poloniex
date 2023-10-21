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

PoloniexPrivate.prototype.getAccountInfo = function() {
  const path="/accounts",options={};
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getAccountBalances = function(id,options={}) {
  var path="/accounts/"+(id==undefined?"":id+"/")+"balances";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getAccountActivity = function(options) {
  const path="/accounts/activity";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.accountTransfer = function(options) {
  const path="/accounts/transfer";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.getAccountTransfers = function(id,options={}) {
  const path="/accounts/transfer"+(id==undefined?"":"/"+id);
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getFees = function() {
  const path="/feeinfo",options={};
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getInterestHistory = function(options) {
  const path="/accounts/interest/history";
  return this.getQuery(path,options,SIGN);
};

//
// Subaccounts
//

PoloniexPrivate.prototype.getSubaccountInfo = function() {
  const path="/subaccounts",options={};
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getSubaccountBalances = function(id,options={}) {
  var path="/subaccounts/"+(id==undefined?"":id+"/")+"balances";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.subaccountTransfer = function(options) {
  const path="/subaccounts/transfer";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.getSubaccountTransfers = function(id,options={}) {
  const path="/subaccounts/transfer"+(id==undefined?"":"/"+id);
  return this.getQuery(path,options,SIGN);
};

//
// Wallets
//

PoloniexPrivate.prototype.getDepositAddresses = function(options={}) {
  const path="/wallets/addresses";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getWalletActivity = function(options) {
  const path="/wallets/activity";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.createCurrencyAddress = function(options) {
  const path="/wallets/address";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.withdrawCurrency = function(options) {
  const path="/wallets/withdraw";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.withdrawCurrencyV2 = function(options) {
  const path="/v2/wallets/withdraw";
  return this.otherQuery("POST",path,options,SIGN);
};

//
// Margin
//

PoloniexPrivate.prototype.getMargin = function(options={}) {
  const path="/margin/accountMargin";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getBorrowStatus = function(options={}) {
  const path="/margin/borrowStatus";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getMaxAmount = function(options) {
  const path="/margin/maxSize";
  return this.getQuery(path,options,SIGN);
};

//
// Orders
//

PoloniexPrivate.prototype.createSpotOrder = function(options) {
  const path="/orders";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.createSpotOrders = function(options) {
  const path="/orders/batch";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.replaceSpotOrder = function(id,options) {
  const path="/orders/"+id;
  return this.otherQuery("PUT",path,options,SIGN);
};

PoloniexPrivate.prototype.getSpotOrders = function(options={}) {
  const path="/orders";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getSpotOrder = function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.getQuery(path,{},SIGN);
};

PoloniexPrivate.prototype.cancelSpotOrder = function(options) {
  const path="/orders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.otherQuery("DELETE",path,{},SIGN);
};

PoloniexPrivate.prototype.cancelSpotOrders = function(options) {
  const path="/orders/cancelByIds";
  return this.otherQuery("DELETE",path,options,SIGN);
};

PoloniexPrivate.prototype.cancelAllSpotOrders = function(options={}) {
  const path="/orders";
  return this.otherQuery("DELETE",path,options,SIGN);
};

PoloniexPrivate.prototype.doKillSwitch = function(options) {
  const path="/orders/killSwitch";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.getKillSwitch = function(options) {
  const path="/orders/killSwitchStatus";
  return this.getQuery(path,options,SIGN);
};

//
// Smart Orders
//

PoloniexPrivate.prototype.createSmartOrder = function(options) {
  const path="/smartorders";
  return this.otherQuery("POST",path,options,SIGN);
};

PoloniexPrivate.prototype.replaceSmartOrder = function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.otherQuery("PUT",path,{},SIGN);
};

PoloniexPrivate.prototype.getSmartOrders = function(options={}) {
  const path="/smartorders";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getSmartOrder = function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.getQuery(path,{},SIGN);
};

PoloniexPrivate.prototype.cancelSmartOrder = function(options) {
  const path="/smartorders/"+(options.hasOwnProperty("orderId")?options.orderId:"cid:"+options.clientOrderId);
  return this.otherQuery("DELETE",path,{},SIGN);
};

PoloniexPrivate.prototype.cancelSmartOrders = function(options) {
  const path="/smartorders/cancelByIds";
  return this.otherQuery("DELETE",path,options,SIGN);
};

PoloniexPrivate.prototype.cancelAllSmartOrders = function(options={}) {
  const path="/smartorders";
  return this.otherQuery("DELETE",path,options,SIGN);
};

//
// Order History
//

PoloniexPrivate.prototype.getOrderHistory = function(id,options={}) {
  var path="/orders/history";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getSmartOrderHistory = function(id,options={}) {
  var path="/smartorders/history";
  return this.getQuery(path,options,SIGN);
};

//
// Trades
//

PoloniexPrivate.prototype.getMyTrades = function(options={}) {
  var path="/trades";
  return this.getQuery(path,options,SIGN);
};

PoloniexPrivate.prototype.getOrderTrades = function(id) {
  var path="/orders/"+id+"/trades";
  return this.getQuery(path,options,SIGN);
};

