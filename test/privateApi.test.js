const
  dotenv = require("dotenv").config(),
  poloniex = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new poloniex.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

const
  symbol="BTC_USDT",
  quote="USDT",
  base="BTC",
  limit=5,
  depth=5;

// Normal requests

describe('Accounts', () => {

  test('Test getAccountInfo() function', async () => {
    expect(stringIsArray(await privateAPI.getAccountInfo())).toBe(true);
  }, timeout);

  test('Test getAccountBalances() function', async () => {
    expect(stringIsArray(await privateAPI.getAccountBalances())).toBe(true);
  }, timeout);
		
  test('Test getAccountActivity() function', async () => {
    expect(stringIsArray(await privateAPI.getAccountActivity())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.accountTransfer = async function(options) {

  test('Test getAccountTransfers() function', async () => {
    expect(stringIsArray(await privateAPI.getAccountTransfers())).toBe(true);
  }, timeout);

  test('Test getFees() function', async () => {
    expect(await privateAPI.getFees()).toHaveProperty("makerRate");
  }, timeout);

  test('Test getInterestHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getInterestHistory())).toBe(true);
  }, timeout);

});

describe('Subaccounts', () => {

  test('Test getSubaccountInfo() function', async () => {
    expect(stringIsArray(await privateAPI.getSubaccountInfo())).toBe(true);
  }, timeout);

  test('Test getSubaccountBalances() function', async () => {
    expect(stringIsArray(await privateAPI.getSubaccountBalances())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.subaccountTransfer = async function(options) {

  test('Test getSubaccountTransfers() function', async () => {
    expect(stringIsArray(await privateAPI.getSubaccountTransfers())).toBe(true);
  }, timeout);

});

describe('Wallets', () => {

  test('Test getDepositAddresses() function', async () => {
    expect(objectIsJSON(await privateAPI.getDepositAddresses())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.getWalletActivity
  // PoloniexPrivate.prototype.createCurrencyAddress
  // PoloniexPrivate.prototype.withdrawCurrency
  // PoloniexPrivate.prototype.withdrawCurrencyV2

});

describe('Margin', () => {

  // PoloniexPrivate.prototype.getMargin = async function(options={}) {

  test('Test getBorrowStatus() function', async () => {
    expect(stringIsArray(await privateAPI.getBorrowStatus())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.getMaxAmount = async function(options) {

});

describe('Orders', () => {

  // PoloniexPrivate.prototype.createSpotOrder = async function(options) {
  // PoloniexPrivate.prototype.createSpotOrders = async function(options) {
  // PoloniexPrivate.prototype.replaceSpotOrder = async function(id,options) {

  test('Test getSpotOrders() function', async () => {
    expect(stringIsArray(await privateAPI.getSpotOrders())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.getSpotOrder = async function(options) {
  // PoloniexPrivate.prototype.cancelSpotOrder = async function(options) {
  // PoloniexPrivate.prototype.cancelSpotOrders = async function(options) {

  // PoloniexPrivate.prototype.cancelAllSpotOrders = async function(options={}) {

  test('Test cancelAllSpotOrders() function', async () => {
    const result=await privateAPI.cancelAllSpotOrders()
    expect(result === "" || stringIsJSON(result)).toBe(true); // "" if none, {} if 1+ orders to cancel
  }, timeout);

  test('Test setKillSwitch() function', async () => {
    options={timeout: 10};
    expect(await privateAPI.setKillSwitch(options)).toHaveProperty("startTime");
  }, timeout);

  test('Test getKillSwitch() function', async () => {
    expect(await privateAPI.getKillSwitch()).toHaveProperty("startTime");
  }, timeout);

  test('Test getOrderHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getOrderHistory())).toBe(true);
  }, timeout);

});

describe('Smart Orders', () => {

  // PoloniexPrivate.prototype.createSmartOrder = async function(options) {
  // PoloniexPrivate.prototype.replaceSmartOrder = async function(options) {
  // PoloniexPrivate.prototype.getSmartOrders = async function(options={}) {
  // PoloniexPrivate.prototype.getSmartOrder = async function(options) {
  // PoloniexPrivate.prototype.cancelSmartOrder = async function(options) {
  // PoloniexPrivate.prototype.cancelSmartOrders = async function(options) {
  // PoloniexPrivate.prototype.cancelAllSmartOrders = async function(options={}) {

  test('Test getSmartOrderHistory() function', async () => {
    expect(stringIsArray(await privateAPI.getSmartOrderHistory())).toBe(true);
  }, timeout);

});

describe('Trades', () => {

  test('Test getMyTrades() function', async () => {
    expect(stringIsArray(await privateAPI.getMyTrades())).toBe(true);
  }, timeout);

  // PoloniexPrivate.prototype.getOrderTrades = async function(id) {

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
