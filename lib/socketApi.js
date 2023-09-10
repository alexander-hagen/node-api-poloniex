const
  axios = require('axios'),
  crypto = require('crypto'),
  WebSocket = require('ws');

const
  publicUrl  = 'wss://ws.poloniex.com/ws/public',
  privateUrl = 'wss://ws.poloniex.com/ws/private';

var SocketNum=0;
class SocketClient {

  constructor(url, keys, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._promises = new Map();
    this._handles = new Map();

    this._pingInterval = undefined;

    this._createSocket(url);

    this.name=(keys==undefined?"public":keys.name);
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);
    this._ws.onopen = async () => {
      console.log('ws connected', this.name);
      this._pingInterval = setInterval(sendPing, 20000, this);

      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {
      console.log('ws closed', this.name);
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
      });
      clearInterval(this._pongInterval);
    };

    this._ws.onerror = err => {
      console.log('ws error', this.name, err);
    };

    this._ws.onmessage = msg => {
      var key;

      var message,parts,method,symbol,option;
//      if(this.compressed) { message = JSON.parse(pako.inflate(msg.data,{to:'string'})); } else { message=JSON.parse(msg.data); };
      message=JSON.parse(msg.data);

      switch(message.event) {
        case "subscribe":
        case "UNSUBSCRIBE":
        case "UNSUBSCRIBE_ALL":
//          console.log("Response",message);
          key=message.event+":"+message.channel;
          if (this._promises.has(key)) {
            const cb = this._promises.get(key);
            this._promises.delete(key);
            cb.resolve({code:"200", data: key});
          } else {
            console.log('Unprocessed response', this._promises, key, message)
          };
          break;

        case "pong":
//          console.log("Response",message);
          break;

        case "subscriptions":
          console.log("Response",message);
          break;

        default:
          switch(true) {
            case message.channel=="auth":
              console.log("Response",message);

              if(message.data.success) {
                this.authenticated=true;
                this._ws.emit('authenticated');
              } else {
                this.authenticated=false;
                this._ws.emit('failed',message.channel,message.data);
              };

              key=message.channel;
              if (this._promises.has(key)) {
                const cb = this._promises.get(key);
                this._promises.delete(key);
                cb.resolve({code:"200", data: key});
              } else {
                console.log('Unprocessed response', this._promises, key, message)
              };
              break;

            case message.hasOwnProperty("channel"):
//              console.log("Received",message);
              method=message.channel.split("_")[0]+(message.hasOwnProperty("action")?"."+message.action:"");
              if (this._handles.has(method)) {
                this._handles.get(method).forEach((cb,i) => { cb(method,message); });
              } else { console.log('ws no handler', method); };
              break;

            case message.hasOwnProperty("id"):
              console.log("Received",message);
              method="trading";
              if (this._handles.has(method)) {
                this._handles.get(method).forEach((cb,i) => { cb(method,message); });
              } else { console.log('ws no handler', method); };

              key=message.id;
              if (this._promises.has(key)) {
                const cb = this._promises.get(key);
                this._promises.delete(key);
                cb.resolve({code:"200", data: key});
              } else {
                console.log('Unprocessed response', this._promises, key, message)
              };
              break;

            default:
              console.log('Unprocessed response', this._promises, key, message);
              break;

          };
          break;   

      };

    };

  }

  async request(key, options) {

    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        this._promises.set(key, {resolve, reject});
        this._ws.send(JSON.stringify(options));
        setTimeout(() => {
          if (this._promises.has(key)) {
            this._promises.delete(key);
            reject({"code":"408","error":"Request Timeout","data":options});
          };
        }, 10000);
      });
    } else { console.log("ws socket unavailable"); };

  }

  setHandler(key, callback) {
    this._handles.set(key, []);
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

}

function sendPing(socket) {
  if(socket._ws==null) { return; };

  const options={ event: "ping"};
//  console.log("Send ping",socket.name,options);

  socket._ws.send(JSON.stringify(options));
}

function terminateSocket(socket) {

  console.log("Terminate socket "+socket.name);

  if(socket._ws!==null) {
    socket._ws.emit('closed');
    clearInterval(this._pingInterval);
    socket._ws.terminate();
//    socket._ws=null; // will be set to null when close is triggered
  };

};

var PoloniexSocket = function(url, keys) {
  this.endPoint = "https://open.poloniex.com";
  this.baseURL = url;
  this.timeout = 5000;
  if(keys) {
    this.apikey = keys.apikey;
    this.secret = keys.secret;
  };
  this.initialized = false;
  this.authenticated = false;

  this.socket = new SocketClient(url, keys,async () => {
    this.initialized=true;
    if(keys==undefined) { this.socket._ws.emit('initialized'); }
    else { this.login(keys); };
  });

};

module.exports = {
  publicApi: function() { return new PoloniexSocket(publicUrl, undefined); },
  privateApi: function(keys) { return new PoloniexSocket(privateUrl, keys); }
};

PoloniexSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

PoloniexSocket.prototype.clearHandler = function(method) {
  this.socket.clearHandler(method);
};

PoloniexSocket.prototype.query = function(options) {

  return axios(options).then(function(res) {
    return res.data
  }).catch(function(err) {
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
//        error: err.response.data.message,
//        reason: err.response.data.code,
        data: options
      };
    };

    return response;
  });
};

PoloniexSocket.prototype.getQuery = function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return this.query(options);
};

PoloniexSocket.prototype.otherQuery = function(method,path,query) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return this.query(options);
};

//
// WEBSOCKET FEED
//

// Reference Data (Public)

PoloniexSocket.prototype.unsubscribeAll = async function() {
  const
    channel="symbols",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeSymbol = async function(symbols) {
  const
    channel="symbols",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeSymbol = async function(symbols) {
  const
    channel="symbols",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeCurrencies = async function(currencies) {
  const
    channel="currencies",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "currencies": currencies
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeCurrencies = async function(currencies) {
  const
    channel="currencies",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "currencies": currencies
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeExchange = async function() {
  const
    channel="exchange",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel]
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeExchange = async function() {
  const
    channel="exchange",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel]
  };
  const result = await this.socket.request(key,options);
  return result;
};

// Market Data (Public)

PoloniexSocket.prototype.subscribeCandles = async function(symbols,period) {
  const
    channel="candles_"+period,
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeCandles = async function(symbols,period) {
  const
    channel="candles_"+period,
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeTrades = async function(symbols) {
  const
    channel="trades",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeTrades = async function(symbols) {
  const
    channel="trades",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeTicker = async function(symbols) {
  const
    channel="ticker",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeTicker = async function(symbols) {
  const
    channel="ticker",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeOrderbook = async function(symbols,depth=20) {
  const
    channel="book",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols,
    "depth": depth
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeOrderbook = async function(symbols) {
  const
    channel="book",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeFullOrderbook = async function(symbols) {
  const
    channel="book_lv2",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeFullOrderbook = async function(symbols) {
  const
    channel="book_lv2",
    key="UNSUBSCRIBE:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

// Private Channels

PoloniexSocket.prototype.login = async function(auth) {
  const
    channel="auth",
    key=channel,
    stamp=Date.now(),
    source="GET\n/ws\nsignTimestamp="+stamp;
  var signature = crypto.createHmac('sha256',auth.secret).update(source).digest('base64');

  const options={
    "event":"subscribe",
    "channel": [channel],
    "params": {
      "key": auth.apikey,
      "signTimestamp": stamp,
      "signature": signature
    }
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeOrders = async function(symbols=["all"]) {
  const
    channel="orders",
    key="subscribe:"+channel;
  const options={
    "event": "subscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeOrders = async function(symbols=["all"]) {
  const
    channel="orders",
    key="unsubscribe:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel],
    "symbols": symbols
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.subscribeBalances = async function() {
  const
    channel="balances",
    key="subscribe:"+channel;
  const options={
    "event":"subscribe",
    "channel": [channel]
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.unsubscribeBalances = async function() {
  const
    channel="balances",
    key="unsubscribe:"+channel;
  const options={
    "event":"unsubscribe",
    "channel": [channel]
  };
  const result = await this.socket.request(key,options);
  return result;
};

// Trade requests

PoloniexSocket.prototype.createOrder = async function(opts) {
  const key="ReqID"+(++this._id);
  const options={
    "id": key,
    "event":"createOrder",
    "params": opts
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.cancelOrders = async function(opts) {
  const key="ReqID"+(++this._id);
  const options={
    "id": key,
    "event":"cancelOrders",
    "params": opts
  };
  const result = await this.socket.request(key,options);
  return result;
};

PoloniexSocket.prototype.cancelAllOrders = async function() {
  const key="ReqID"+(++this._id);
  const options={
    "id": key,
    "event":"cancelAllOrders",
    "params": {}
  };
  const result = await this.socket.request(key,options);
  return result;
};
