const
  dotenv = require("dotenv").config(),
  poloniex = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET;

const
  symbol="BTC_USDT",
  quote="USDT",
  base="BTC",
  limit=5,
  depth=5;


const timeout=5000;

// Get sockets

var token;

var accountAPI;
var timers={};

describe('Public', () => {

  var publicAPI;

  beforeAll(async () => { // initialize socket
    publicAPI=new poloniex.sockets.publicApi();
    await waitForConnection(publicAPI);
    await publicAPI.setHandler('symbols.snapshot',    (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('symbols',             (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('currencies.snapshot', (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('currencies',          (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('exchange.snapshot',   (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('exchange',            (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('trades',              (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('ticker',              (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('ticker.update',       (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('book',                (method,data,symbol,stamp) => { eventHandler(method); });
    await publicAPI.setHandler('book.update',         (method,data,symbol,stamp) => { eventHandler(method); });
    return;
  });

  // PoloniexSocket.prototype.unsubscribeAll = async function() {

  test('Test subscribeSymbol() function', async () => {
    const options=[symbol];
    expect(await publicAPI.subscribeSymbol(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeSymbol() function', async () => {
    const options=[symbol];
    expect(await publicAPI.unsubscribeSymbol(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeCurrencies() function', async () => {
    const options=[base,quote];
    expect(await publicAPI.subscribeCurrencies(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeCurrencies() function', async () => {
    const options=[base,quote];
    expect(await publicAPI.unsubscribeCurrencies(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeExchange() function', async () => {
    expect(await publicAPI.subscribeExchange()).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeExchange() function', async () => {
    expect(await publicAPI.unsubscribeExchange()).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeCandles() function', async () => {
    const options=[symbol],interval="minute_1";
    expect(await publicAPI.subscribeCandles(options,interval)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeCandles() function', async () => {
    const options=[symbol],interval="minute_1";
    expect(await publicAPI.unsubscribeCandles(options,interval)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeTrades() function', async () => {
    const options=[symbol];
    expect(await publicAPI.subscribeTrades(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeTrades() function', async () => {
    const options=[symbol];
    expect(await publicAPI.unsubscribeTrades(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeTicker() function', async () => {
    const options=[symbol];
    expect(await publicAPI.subscribeTicker(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeTicker() function', async () => {
    const options=[symbol];
    expect(await publicAPI.unsubscribeTicker(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeOrderBook() function', async () => {
    const options=[symbol];
    expect(await publicAPI.subscribeOrderBook(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeOrderBook() function', async () => {
    const options=[symbol];
    expect(await publicAPI.unsubscribeOrderBook(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeFullOrderBook() function', async () => {
    const options=[symbol];
    expect(await publicAPI.subscribeFullOrderBook(options)).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeFullOrderBook() function', async () => {
    const options=[symbol];
    expect(await publicAPI.unsubscribeFullOrderBook(options)).toHaveProperty("code","200");
  }, timeout);

  afterAll(async () => { // clean-up socket
    await publicAPI.clearHandler('symbols.snapshot');
    await publicAPI.clearHandler('symbols');
    await publicAPI.clearHandler('currencies.snapshot');
    await publicAPI.clearHandler('currencies');
    await publicAPI.clearHandler('exchange.snapshot');
    await publicAPI.clearHandler('exchange');
    await publicAPI.clearHandler('trades');
    await publicAPI.clearHandler('ticker');
    await publicAPI.clearHandler('ticker.update');
    await publicAPI.clearHandler('book');
    await publicAPI.clearHandler('book.update');
    await publicAPI.socket.terminate();
    await waitForConnection(publicAPI);
  });

});

describe('Private', () => {

  var privateAPI;

  beforeAll(async () => { // initialize socket
    privateAPI=new poloniex.sockets.privateApi({ "apikey": apikey, "secret": secret });
    await waitForConnection(privateAPI);
    await privateAPI.setHandler('orders',   (method,data,symbol,stamp) => { eventHandler(method); });
    await privateAPI.setHandler('balances', (method,data,symbol,stamp) => { eventHandler(method); });
    return;
  });

  // PoloniexSocket.prototype.login = async function(auth) {

  test('Test subscribeOrders() function', async () => {
    expect(await privateAPI.subscribeOrders()).toHaveProperty("code","200");
  }, timeout);

  test('Test subscribeBalances() function', async () => {
    expect(await privateAPI.subscribeBalances()).toHaveProperty("code","200");
  }, timeout);

  // PoloniexSocket.prototype.createOrder = async function(opts) {
  // PoloniexSocket.prototype.cancelOrders = async function(opts) {
  // PoloniexSocket.prototype.cancelAllOrders = async function() {

  test('Test cancelAllOrders() function', async () => {
    expect(await privateAPI.cancelAllOrders()).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeOrders() function', async () => {
    expect(await privateAPI.unsubscribeOrders()).toHaveProperty("code","200");
  }, timeout);

  test('Test unsubscribeBalances() function', async () => {
    expect(await privateAPI.unsubscribeBalances()).toHaveProperty("code","200");
  }, timeout);

  afterAll(async () => { // clean-up socket
    await privateAPI.clearHandler('orders');
    await privateAPI.clearHandler('balances');
    privateAPI.socket.terminate();
    await waitForConnection(privateAPI);
  });

});

// Error testing

// Helper functions

function stringIsJSON(str) {
  try { 
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function objectIsJSON(obj) {
  try { 
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

function checkError(obj,code,reason) {
  if(obj.code==code && obj.reason==reason) { return true; }
  return false;
};

function waitForConnection(websocket) {
  var socketResolve,socketReject;
  var done=false;
  var timer=setTimeout( () => { if(!done) { socketReject(done); }; }, timeout);

  websocket.socket._ws.on('authenticated', async () => { // Wait for websocket to authenticate.
    console.log('authenticated');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('initialized', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('closed', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  var promise=new Promise(function(resolve, reject) { socketResolve=resolve; socketReject=reject; });

  return promise;
};

var _promises = new Map();

function eventHandler(key) {
//  console.log("Received event ",key);
  if (_promises.has(key)) {
    clearTimeout(timers[key]);
    const cb = _promises.get(key);
    _promises.delete(key);
    cb.resolve({code:"200", data: key});
  };
};

function waitForPromise(key) {
  var promise=new Promise((resolve, reject) => {
    _promises.set(key, {resolve, reject});
    timers[key]=setTimeout(() => {
      if (_promises.has(key)) {
        _promises.delete(key);
        reject({"code":"408", "data": key});
      };
    }, timeout-1000);
  });
  return promise;
};
