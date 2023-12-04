// Define the symbols and API keys
const symbols = ['btc', 'eth', 'eth/btc', 'vxv', 'apt', 'ada', 'near'];
const cryptoCompareAPIKey = '$CRYPTOCOMPAREAPIKEY';
const alphaVantageAPIKey = '$ALPHAVANTAGEAPIKEY';
const btcSymbol = 'btc';
const iconUrl = "https://cdn.coinranking.com/bOabBYkcX/bitcoin_btc.svg";
const toSymbol = 'USD';

// Define the high and low values for each symbol
const highLowValues = {
    'btc': { 'high': 85000, 'low': 16500 },
    'eth': { 'high': 6500, 'low': 850 },
    'eth/btc': { 'high': 0.0700, 'low': 0.0300 },
    'vxv': { 'high': 5, 'low': 0.01 }, 
    'apt': { 'high': 50, 'low': 1 },
    'ada': { 'high': 5, 'low': 0.3 },
    'near': { 'high': 33, 'low': 1 },
};
