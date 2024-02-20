const
  poloniex = require("../index.js");

const
  publicAPI=new poloniex.publicApi(),
  timeout=publicAPI.timeout;

const
  symbol="BTC_USDT",
  quote="USDT",
  base="BTC",
  limit=5,
  depth=5;

describe('Spot Reference Data', () => {

  test('Test getCurrency() function', async () => {
    expect(stringIsArray(await publicAPI.getCurrency())).toBe(true);
  }, timeout);

  test('Test getCurrency(currency) function', async () => {
    expect(await publicAPI.getCurrency(base)).toHaveProperty(base);
  }, timeout);

  test('Test getCurrencyV2() function', async () => {
    expect(stringIsArray(await publicAPI.getCurrencyV2())).toBe(true);
  }, timeout);

  test('Test getCurrencyV2(currency) function', async () => {
    expect(await publicAPI.getCurrencyV2(base)).toHaveProperty("coin",base);
  }, timeout);

  test('Test getSymbol() function', async () => {
    expect(stringIsArray(await publicAPI.getSymbol())).toBe(true);
  }, timeout);

  test('Test getSymbol(symbol) function', async () => {
    const result=await publicAPI.getSymbol(symbol);
    expect(result[0]).toHaveProperty("symbol",symbol);
  }, timeout);

  test('Test getServerTime() function', async () => {
    expect(await publicAPI.getServerTime()).toHaveProperty("serverTime");
  }, timeout);

});

describe('Spot Market Data', () => {

  test('Test getPrices() function', async () => {
    expect(stringIsArray(await publicAPI.getPrices())).toBe(true);
  }, timeout);

  test('Test getPrices(symbol) function', async () => {
    expect(await publicAPI.getPrices(symbol)).toHaveProperty("symbol",symbol);
  }, timeout);

  test('Test getMarkPrice() function', async () => {
    expect(stringIsArray(await publicAPI.getMarkPrice())).toBe(true);
  }, timeout);

  test('Test getMarkPrice(symbol) function', async () => {
    expect(await publicAPI.getMarkPrice(symbol)).toHaveProperty("symbol",symbol);
  }, timeout);

  test('Test getMarkPriceComponents(symbol) function', async () => {
    expect(await publicAPI.getMarkPriceComponents(symbol)).toHaveProperty("symbol",symbol);
  }, timeout);

  test('Test getOrderBook(symbol) function', async () => {
    expect(await publicAPI.getOrderBook(symbol,{limit: limit})).toHaveProperty("scale");
  }, timeout);

  test('Test getCandles(symbol) function', async () => {
    expect(stringIsArray(await publicAPI.getCandles(symbol,{interval: "MINUTE_1", limit: limit}))).toBe(true);
  }, timeout);

  test('Test getTrades(symbol) function', async () => {
    expect(stringIsArray(await publicAPI.getTrades(symbol))).toBe(true);
  }, timeout);

  test('Test getTicker24h() function', async () => {
    expect(stringIsArray(await publicAPI.getTicker24h())).toBe(true);
  }, timeout);

  test('Test getTicker24h(symbol) function', async () => {
    expect(await publicAPI.getTicker24h(symbol)).toHaveProperty("symbol",symbol);
  }, timeout);

});

describe('Spot Margin Data', () => {

  test('Test getCollateralInfo() function', async () => {
    expect(stringIsArray(await publicAPI.getCollateralInfo())).toBe(true);
  }, timeout);

  test('Test getCollateralInfo(currency) function', async () => {
    expect(await publicAPI.getCollateralInfo(base)).toHaveProperty("currency",base);
  }, timeout);

  test('Test getBorrowRatesInfo() function', async () => {
    expect(stringIsArray(await publicAPI.getBorrowRatesInfo())).toBe(true);
  }, timeout);

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

function stringIsArray(str) {
  try { 
    return Array.isArray(str);
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