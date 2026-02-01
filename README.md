# node-api-poloniex

![Statements](https://img.shields.io/badge/statements-66.21%25-red.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-44.33%25-red.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-65.51%25-red.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-71.9%25-red.svg?style=flat)

Non-official implementation of Poloniex's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

Websocket keep connection alive by sending ping at 20 sec intervals

## __PUBLIC API__

```javascript
  const poloniex=require('node-api-poloniex');

  const publicAPI=new poloniex.publicApi();

```

### Reference Data

| API                     | DESCRIPTION |
| :----                   | :---- |
| getSymbols              | https://api-docs.poloniex.com/spot/api/public/reference-data#symbol-information     |
| getCurrencies           | https://api-docs.poloniex.com/spot/api/public/reference-data#currency-information   |
| getCurrenciesV2         | https://api-docs.poloniex.com/spot/api/public/reference-data#currencyv2-information |
| getServerTime           | https://api-docs.poloniex.com/spot/api/public/reference-data#system-timestamp       |

### Market Data

| API                     | DESCRIPTION |
| :----                   | :---- |
| getPrices               | https://api-docs.poloniex.com/spot/api/public/market-data#prices                |
| getMarkPrice            | https://api-docs.poloniex.com/spot/api/public/market-data#mark-price            |
| getMarkPriceComponents  | https://api-docs.poloniex.com/spot/api/public/market-data#mark-price-components |
| getOrderBook            | https://api-docs.poloniex.com/spot/api/public/market-data#order-book            |
| getCandles              | https://api-docs.poloniex.com/spot/api/public/market-data#candles               |
| getTrades               | https://api-docs.poloniex.com/spot/api/public/market-data#trades                |
| getTicker24h            | https://api-docs.poloniex.com/spot/api/public/market-data#ticker                |

### Margin

| API                     | DESCRIPTION |
| :----                   | :---- |
| getCollateralInfo       | https://api-docs.poloniex.com/spot/api/public/margin#collateral-info   |
| getBorrowRatesInfo      | https://api-docs.poloniex.com/spot/api/public/margin#borrow-rates-info |

## __PRIVATE API__

```javascript
  const poloniex=require('node-api-poloniex');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new poloniex.privateApi(auth);

```

### Accounts

| API                     | DESCRIPTION |
| :----                   | :---- |
| getAccountInfo          | https://api-docs.poloniex.com/spot/api/private/account#account-information       |
| getAccountBalances      | https://api-docs.poloniex.com/spot/api/private/account#all-account-balances      |
| getAccountActivity      | https://api-docs.poloniex.com/spot/api/private/account#account-activity          |
| accountTransfer         | https://api-docs.poloniex.com/spot/api/private/account#accounts-transfer         |
| getAccountTransfers     | https://api-docs.poloniex.com/spot/api/private/account#accounts-transfer-records |
| getFees                 | https://api-docs.poloniex.com/spot/api/private/account#fee-info                  |
| getInterestHistory      | https://api-docs.poloniex.com/spot/api/private/account#interest-history          |

### Subaccounts

| API                     | DESCRIPTION |
| :----                   | :---- |
| getSubaccountInfo       | https://api-docs.poloniex.com/spot/api/private/subaccount#subaccount-information      |
| getSubaccountBalances   | https://api-docs.poloniex.com/spot/api/private/subaccount#subaccount-balances         |
| subaccountTransfer      | https://api-docs.poloniex.com/spot/api/private/subaccount#subaccount-transfer         |
| getSubaccountTransfers  | https://api-docs.poloniex.com/spot/api/private/subaccount#subaccount-transfer-records |

### Wallets

| API                     | DESCRIPTION |
| :----                   | :---- |
| getDepositAddresses     | https://api-docs.poloniex.com/spot/api/private/wallet#deposit-addresses        |
| getWalletActivity       | https://api-docs.poloniex.com/spot/api/private/wallet#wallets-activity-records |
| getCurrencyAddress      | https://api-docs.poloniex.com/spot/api/private/wallet#new-currency-address     |
| withdrawCurrency        | https://api-docs.poloniex.com/spot/api/private/wallet#withdraw-currency        |
| withdrawCurrencyV2      | https://api-docs.poloniex.com/spot/api/private/wallet#withdraw-currency-v2     |

### Margin

| API                     | DESCRIPTION |
| :----                   | :---- |
| getMargin               | https://api-docs.poloniex.com/spot/api/private/margin#account-margin         |
| getBorrowStatus         | https://api-docs.poloniex.com/spot/api/private/margin#borrow-status          |
| getMaxAmount            | https://api-docs.poloniex.com/spot/api/private/margin#maximum-buysell-amount |

### Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| createSpotOrder         | https://api-docs.poloniex.com/spot/api/private/order#create-order                  |
| createSpotOrders        | https://api-docs.poloniex.com/spot/api/private/order#create-multiple-orders        |
| replaceSpotOrder        | https://api-docs.poloniex.com/spot/api/private/order#cancel-replace-order          |
| getSpotOrders           | https://api-docs.poloniex.com/spot/api/private/order#open-orders                   |
| getSpotOrder            | https://api-docs.poloniex.com/spot/api/private/order#order-details                 |
| cancelSpotOrder         | https://api-docs.poloniex.com/spot/api/private/order#cancel-order-by-id            |
| cancelSpotOrders        | https://api-docs.poloniex.com/spot/api/private/order#cancel-multiple-orders-by-ids |
| cancelAllSpotOrders     | https://api-docs.poloniex.com/spot/api/private/order#cancel-all-orders             |
| setKillSwitch           | https://api-docs.poloniex.com/spot/api/private/order#kill-switch                   |
| getKillSwitch           | https://api-docs.poloniex.com/spot/api/private/order#kill-switch-status            |
| getOrderHistory         | https://api-docs.poloniex.com/spot/api/private/order-history#orders-history        |

### Smart Orders

| API                     | DESCRIPTION |
| :----                   | :---- |
| createSmartOrder        | https://api-docs.poloniex.com/spot/api/private/smart-order#create-order                 |
| replaceSmartOrder       | https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-replace-order         |
| getSmartOrders          | https://api-docs.poloniex.com/spot/api/private/smart-order#open-orders                  |
| getSmartOrder           | https://api-docs.poloniex.com/spot/api/private/smart-order#order-details                |
| cancelSmartOrder        | https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-order-by-id           |
| cancelSmartOrders       | https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-multiple-orders-by-id |
| cancelAllSmartOrders    | https://api-docs.poloniex.com/spot/api/private/smart-order#cancel-all-orders            |
| getSmartOrderHistory    | https://api-docs.poloniex.com/spot/api/private/order-history#smart-orders-history       |

### Trades

| API                     | DESCRIPTION |
| :----                   | :---- |
| getMyTrades             | https://api-docs.poloniex.com/spot/api/private/trade#trade-history      |
| getOrderTrades          | https://api-docs.poloniex.com/spot/api/private/trade#trades-by-order-id |

## __WEBSOCKET API__

```javascript
  const poloniex=require('node-api-poloniex');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const publicAPI=new poloniex.sockets.publicApi();
  publicAPI.setHandler('book.snapshot', (method,data,symbol) => { snapshotOrderbook(symbol,method,data,handler); });
  publicAPI.setHandler('book.update', (method,data,symbol) => { updateOrderbook(symbol,method,data,handler); });

  publicAPI.socket._ws.on('initialized', async () => {
    // do your own initialization, e.g. subscribe to orderbook
  });

  function snapshotOrderbook(symbol,method,data,handler) {
    // do something
  };

  function updateOrderbook(symbol,method,data,handler) {
    // do something
  };

  const privateAPI=new poloniex.sockets.privateApi(auth);

  privateAPI.socket._ws.on('authenticated', async () => {
    // do your own initialization, e.g. subscribe to updates
  });

  privateAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };


```

### Public API

| API                                             | HANDLER                   | DESCRIPTION |
| :----                                           | :----                     | :---- |
| subscribeSymbols unsubscribeSymbols             | symbols.snapshot          | |
| subscribeCandles unsubscribeCandles             | currencies.snapshot       | |
| subscribeExchange unsubscribeExchange           | exchange.snapshot         | |
| subscribeCandles unsubscribeCandles             | candles                   | |
| subscribeTrades unsubscribeTrades               | trades                    | |
| subscribeTicker unsubscribeTicker               | ticker                    | |
| subscribeOrderBook unsubscribeOrderBook         | book                      | |
| subscribeFullOrderBook unsubscribeFullOrderBook | book.snapshot book.update | |

### Private API

| API                                             | HANDLER                   | DESCRIPTION |
| :----                                           | :----                     | :---- |
| subscribeOrders unsubscribeOrders               | orders                    | |
| subscribeBalances unsubscribeBalances           | balances                  | |
| createOrder                                     |                           | |
| cancelOrders                                    |                           | |
| cancelAllOrders                                 |                           | |
