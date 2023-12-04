

// Define the functions for calculating risk and multiple
function calculateRisk(symbol, price) {
    const { high, low } = highLowValues[symbol];
    return ((price - low) / (high - low)).toFixed(3);
}

function calculateMultiple(symbol, price) {
    const high = highLowValues[symbol]['high'];
    return (high / price).toFixed(1) + 'x';
}

// Define the function for getting the risk color
function getRiskColor(risk) {
    const green = Math.floor((1 - risk) * 255);
    const red = Math.floor(risk * 255);
    return `rgb(${red}, ${green}, 0)`;
}

// Define the function for formatting the price
function formatPrice(price) {
    return price < 1 ? price.toFixed(3) : price.toFixed(0);
}

// Define the function for creating a table row
function createTableRow(symbol, price) {
    const risk = calculateRisk(symbol, price);
    const multiple = calculateMultiple(symbol, price);

    const row = document.createElement('tr');
    row.innerHTML = `<td>${symbol.toUpperCase()}</td><td>${price}</td><td style="background-color: ${getRiskColor(risk)};">${risk}</td><td>${multiple}</td>`;
    return row;
}

// Define the function for updating the crypto table
async function updateCryptoTable() {
    const cryptoTableBody = document.getElementById('cryptoTableBody');

    for (const symbol of symbols) {
        let fromSymbol, toSymbol;
        if (symbol === 'eth/btc') {
            fromSymbol = 'ETH';
            toSymbol = 'BTC';
        } else {
            fromSymbol = symbol.toUpperCase();
            toSymbol = 'USD';
        }

        const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbol}&tsyms=${toSymbol}&api_key=${cryptoCompareAPIKey}`);
        const data = await response.json();
        const price = formatPrice(data.RAW[fromSymbol][toSymbol].PRICE);
        const row = createTableRow(symbol, price);
        cryptoTableBody.appendChild(row);
    }
}

// Define the function for fetching crypto news
async function fetchCryptoNews() {
    const newsApiUrl = `https://min-api.cryptocompare.com/data/v2/news/?api_key=${cryptoCompareAPIKey}`;

    try {
        const response = await fetch(newsApiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const news = data.Data.slice(0, 3).map(article => article.title).join('<br>');
        document.getElementById('cryptoNews').innerHTML = `<td colspan="4">${news}</td>`;
    } catch (error) {
        document.getElementById('cryptoNews').innerHTML = `<td colspan="4">News not available at the moment.</td>`;
    }
}
const cacheName = 'portfolio-risk-v1'; // Change this when you update your app

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/script.js',
                '/styles.css',
                '/java/',
                '/imges/',
                'Crypto/imges/bitcoin.png' // Include all the files your app needs
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});

// Call the functions to initiate the process
updateCryptoTable();
fetchCryptoNews();
