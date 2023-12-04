fetch('https://www.moneycontrol.com/markets/currencies/technical-analysis/dollar-index/daily/')
    .then(response => response.text())
    .then(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let dxyPriceElement = doc.querySelector('.pivoteLevels_web_mctable1___vjT0 > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(5)');
        let dxyPrice = dxyPriceElement.textContent;
        document.getElementById('dxyPrice').textContent = dxyPrice;
    })
    .catch(error => console.error('Error:', error));
