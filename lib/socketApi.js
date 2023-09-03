const
  axios = require('axios'),
  crypto = require('crypto'),
  pako = require('pako'),
  WebSocket = require('ws');

const
  marketUrl  = 'wss://ws.poloniex.com/market/ws', // Market Data Streams WebSocket  (GZIP)
  accountUrl = 'wss://wsapi.poloniex.com/stream?listenKey='; // User Data Streams WebSocket

const
  GZIP=true,
  NOZIP=false;

const
  SIGN=true,
  NOSIGN=false;

var SocketNum=0;
class SocketClient {

  constructor(url, keys, gzip, onConnected) {
    this._id = 1; // Request ID, incrementing
    this._onConnected = onConnected;
    this._promises = new Map();
    this._handles = new Map();

    this._pongInterval = undefined;

    this._createSocket(url);

    this.compressed=gzip;
    this.name=(keys==undefined?"public":keys.name);
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);
    this._ws.onopen = async () => {
      console.log('ws connected', this.name);
      this._pongInterval = setInterval(sendPong, 180000, this);

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
      if(this.compressed) { message = JSON.parse(pako.inflate(msg.data,{to:'string'})); } else { message=JSON.parse(msg.data); };

      switch(true) {
        case message.hasOwnProperty("ping"):
          heartbeat(this, message.ping);
          return;
          break;

        case message.hasOwnProperty("event_rep"):
          console.log("Response",message);
          key=message.event_rep+":"+message.channel;
          if (this._promises.has(key)) {
            const cb = this._promises.get(key);
            this._promises.delete(key);
            cb.resolve({code:"200", data: key});
          } else {
            console.log('Unprocessed response', this._promises, key, message)
          };
          break;

        case message.hasOwnProperty("event"):
          console.log("Response",message);
          switch(message.event) {
            case "ping": break;
            default:
              key=message.event;
              if (this._promises.has(key)) {
                const cb = this._promises.get(key);
                this._promises.delete(key);
                cb.resolve({code:"200", data: key});
              } else {
                console.log('Unprocessed response', this._promises, key, message)
              };
          };
          break;

        case message.hasOwnProperty("listenKey"):
          console.log("Response",message);
          break;

        case message.hasOwnProperty("tick"):
          var parts=message.channel.split("_"),method;
          const symbol=parts[1].toUpperCase();
          parts.splice(1,1);
          method=parts.join(".");

          if (this._handles.has(method)) {
            this._handles.get(method).forEach((cb,i) => { 
              cb(method,message.tick,symbol,message.ts);
             });
          } else {
            console.log('ws no handler', method);
          };
          break;

        case message.hasOwnProperty("e"):
          method=message.e;
          symbol=message.s;
           if (this._handles.has(method)) {
            this._handles.get(method).forEach((cb,i) => { 
              cb(method,message,symbol,message.E);
             });
          } else {
            console.log('ws no handler', method);
          };
          break;

        default:
          console.log("Unprocessed",method,message);
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

function sendPong(socket) {
  if(socket._ws==null) { return; };

  const options={ event: "pong", ts: Date.now()};
  console.log("Send pong",socket.name,options);

  socket._ws.send(JSON.stringify(options));
}

function terminateSocket(socket) {

  console.log("Terminate socket "+socket.name);

  if(socket._ws!==null) {
    socket._ws.emit('closed');
    socket._ws.terminate();
//    socket._ws=null; // will be set to null when close is triggered
  };

};

function heartbeat(socket,pingid) {

  if(socket._ws==null) { return; };

  options={ pong: pingid }
  console.log('Pong ', socket.name, options);

  socket._ws.send(JSON.stringify(options));
};

var PoloniexSocket = function(url, keys, token, gzip) {
  this.endPoint = "https://open.poloniex.com";
  this.baseURL = url;
  this.timeout = 5000;
  if(keys) {
    this.apikey = keys.apikey;
    this.secret = keys.secret;
  };
  this.initialized = false;
  this.authenticated = false;

  this.token=token;
  this.pingInterval = undefined;
  this.pongInterval = undefined;

  if(url) {
    if(token) { url+=token };
    this.socket = new SocketClient(url, keys, gzip, () => {
      this.initialized=true;
      if(keys!==undefined) { this.socket._ws.emit('authenticated'); } else { this.socket._ws.emit('initialized'); };
    });
  };
};

module.exports = {
  marketApi: function(keys) { return new PoloniexSocket(marketUrl, keys, undefined, GZIP); },
  accountApi: function(keys,token) { return new PoloniexSocket(accountUrl, keys, token, NOZIP); },
  streamApi: function(keys) { return new PoloniexSocket(undefined,keys, undefined, NOZIP); }
};

PoloniexSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

PoloniexSocket.prototype.clearHandler = function(method) {
  this.socket.clearHandler(method);
};

PoloniexSocket.prototype.query = function(options,sign) {

  if(sign) {
    const stamp=Date.now();
    if(!options.data.timestamp && !options.params.timestamp) { options.data["timestamp"]=stamp; };
    var source=JSON.stringify(Object.assign(options.params,options.data));
    var signature = crypto.createHmac('sha256',this.secret).update(source).digest('hex');
    options["params"]["signature"]=signature;
    options["headers"]={ "X-MBX-APIKEY": this.apikey };
  };

  return axios(options).then(function(res) {
    return res.data
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

PoloniexSocket.prototype.getQuery = function(path,query,sign) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
    data: {}
  };
  return this.query(options,sign);
};

PoloniexSocket.prototype.otherQuery = function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
    params: {},
    data: query
  };
  return this.query(options,sign);
};

//
// WEBSOCKET FEED
//

