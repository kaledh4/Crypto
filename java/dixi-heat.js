// Fetch DXY Price
let dxyPrice;
var requestOptions = {
    method: 'GET'
};

var params = {
    api_token: 'jqwxyLsmfZDrCNh8LPijtnuIRAxS03GJV3eJV0EB',
    symbols: 'DXY',
    limit: '1'
};

var esc = encodeURIComponent;
var query = Object.keys(params)
    .map(function(k) {return esc(k) + '=' + esc(params[k]);})
    .join('&');

fetch("https://api.stockdata.org/v1/price?" + query, requestOptions)
  .then(response => response.json())
  .then(result => {
      console.log(result);
      dxyPrice = result.price; // Adjust this according to the actual structure of the returned data
  })
  .catch(error => console.log('error', error));

// Fetch Bitcoin Prices
let heat;
let oldPrice;
let todayPrice;
fetch('https://api.coinranking.com/v2/coin/bitcoin/history', {
    headers: {
        'Authorization': `cfa4f1ddd78a8987e066d7854d1fc676ea5d45f8f9338ba75df6752e6e3d15e5`
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log('Bitcoin Data:', data); // Log the returned data
    if (data.status === 'fail') {
        throw new Error(data.message);
    }
    oldPrice = data.history[140].price; // Assuming the API returns an array of daily prices
    todayPrice = data.history[0].price;
    heat = ((todayPrice - oldPrice) / oldPrice) * 10; // Normalize to a scale of 1-10
})
.catch(error => console.error('Error:', error));

// Log the fetched values
console.log(`DXY Price: ${dxyPrice}`);
console.log(`Bitcoin Price Progress (scale of 1-10): ${heat}`);
