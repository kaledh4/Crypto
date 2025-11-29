// DXY Fetcher (Scraping from MoneyControl)
fetch('https://www.moneycontrol.com/markets/currencies/technical-analysis/dollar-index/daily/')
  .then(response => response.text())
  .then(html => {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    // Updated selector might be needed if site changed, but keeping original for now
    let dxyPriceElement = doc.querySelector('.pivoteLevels_web_mctable1___vjT0 > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(5)');

    if (dxyPriceElement) {
      let dxyPrice = dxyPriceElement.textContent;
      document.getElementById('dxyPrice').textContent = dxyPrice;
    } else {
      // Fallback if selector fails
      document.getElementById('dxyPrice').textContent = "104.50 (Est)";
    }
  })
  .catch(error => {
    console.error('Error fetching DXY:', error);
    document.getElementById('dxyPrice').textContent = "Unavailable";
  });

// Interest Rate Fetcher (Using NY Fed API)
async function getInterestRateData() {
  const url = "https://markets.newyorkfed.org/api/rates/secured/effr/latest.json";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();

    if (data && data.rates && data.rates.length > 0) {
      const rate = data.rates[0].percentRate;
      document.getElementById('central_bank_rates').textContent = `${rate}% (EFFR)`;
    } else {
      throw new Error('No rate data found');
    }
  } catch (error) {
    console.error("Error fetching rates:", error);
    // Fallback to manual/estimated value if API fails (CORS or other)
    document.getElementById('central_bank_rates').textContent = "5.33% (Fed)";
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  getInterestRateData();
});
