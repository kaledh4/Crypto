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
// interestRateScript.js

function getInterestRateData() {
    // The URL of the API
    var url = "https://api.api-ninjas.com/v1/interestrate";
    var apiKey = '$APININJAS';
  
    // The AJAX request to get the JSON data
    $.ajax({
      method: "GET",
      url: url,
      headers: { "X-Api-Key": apiKey },
      contentType: "application/json",
      success: function(data) {
        // Display the interest rate data in the HTML elements
        displayInterestRateForUS(data.central_bank_rates);
      },
      error: function ajaxError(jqXHR) {
        // Handle the error
        console.error("Error: ", jqXHR.responseText);
      }
    });
  }
  
  function displayInterestRateForUS(centralBankRates) {
    // Filter for the Central Bank of the United States
    var usCentralBankRate = centralBankRates.find(function(rate) {
      return rate.central_bank === "American Central Bank" && rate.country === "United States";
    });
  
    // Display the percentage for the Central Bank of the United States
    if (usCentralBankRate) {
      var rateInfo = usCentralBankRate.rate_pct + " BPS";
      $("#central_bank_rates").append( rateInfo );
    } else {
      $("#central_bank_rates").append("<li>No data available for the Central Bank of the United States</li>");
    }
  }
  
  // This function runs when the document is ready
  $(document).ready(function() {
    // Call the function to get the interest rate data
    getInterestRateData();
  });
  
