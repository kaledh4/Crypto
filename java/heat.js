fetch('https://macrovar.com/united-states/us-dollar-index-dxy/')
    .then(response => response.text())
    .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let dxyPriceElement = doc.querySelector('#tab-11 > div > table > tbody > tr > td:nth-child(3) > span');
        let dxyPrice = dxyPriceElement.textContent;
        document.getElementById('dxyPrice').textContent = dxyPrice;
    })
    .catch(error => console.error('Error:', error));
   
const options = {
    headers: {
      'x-access-token': 'cfa4f1ddd78a8987e066d7854d1fc676ea5d45f8f9338ba75df6752e6e3d15e5',
    },
};

fetch('https://api.coinranking.com/v2/coin/bitcoin/history?timePeriod=5y', options)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);  // Add this line
        let oldPrice = result.data.history[140].price;
        console.log(`Bitcoin price 140 days ago: ${oldPrice}`);
    });
