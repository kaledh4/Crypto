// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => console.log('Service Worker registered:', registration.scope))
            .catch(error => console.error('Service Worker registration failed:', error));
    });
}

// PWA Install Logic
let deferredPrompt;
const installPrompt = document.getElementById('install-prompt');
const installBtn = document.getElementById('install-btn');
const installClose = document.getElementById('install-close');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installPrompt.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;
        installPrompt.classList.add('hidden');
    }
});

installClose.addEventListener('click', () => {
    installPrompt.classList.add('hidden');
});

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 1000);
});

// Refresh Button
document.getElementById('refresh-btn').addEventListener('click', () => {
    const icon = document.querySelector('#refresh-btn svg');
    icon.classList.add('animate-spin'); // Add spin class if defined or use inline style
    updateCryptoData();
    fetchCryptoNews();
    setTimeout(() => icon.classList.remove('animate-spin'), 1000);
});

// Risk Calculation Helper
function calculateRisk(symbol, price) {
    if (!highLowValues[symbol]) return 0.5;
    const { high, low } = highLowValues[symbol];
    return ((price - low) / (high - low)).toFixed(3);
}

function calculateMultiple(symbol, price) {
    if (!highLowValues[symbol]) return '0x';
    const high = highLowValues[symbol]['high'];
    return (high / price).toFixed(1) + 'x';
}

function getRiskColor(risk) {
    // 0 = Green, 1 = Red
    // Using HSL for better gradients
    const hue = (1 - risk) * 120; // 120 is Green, 0 is Red
    return `hsl(${hue}, 100%, 40%)`;
}

// Update Crypto Data
async function updateCryptoData() {
    const statsGrid = document.getElementById('stats-grid');
    // Keep the first two cards (DXY, Rates)
    const existingCards = Array.from(statsGrid.children).slice(0, 2);
    statsGrid.innerHTML = '';
    existingCards.forEach(card => statsGrid.appendChild(card));

    const prices = {};

    // Handle placeholder key
    let apiKeyParam = '';
    if (cryptoCompareAPIKey && !cryptoCompareAPIKey.startsWith('$')) {
        apiKeyParam = `&api_key=${cryptoCompareAPIKey}`;
    }

    for (const symbol of symbols) {
        let fromSymbol, toSymbol;
        if (symbol === 'eth/btc') {
            fromSymbol = 'ETH';
            toSymbol = 'BTC';
        } else {
            fromSymbol = symbol.toUpperCase();
            toSymbol = 'USD';
        }

        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${fromSymbol}&tsyms=${toSymbol}${apiKeyParam}`);
            const data = await response.json();

            if (data.Response === 'Error') {
                console.error(`API Error for ${symbol}:`, data.Message);
                continue;
            }

            const rawPrice = data.RAW[fromSymbol][toSymbol].PRICE;
            prices[symbol] = rawPrice;

            const displayPrice = rawPrice < 1 ? rawPrice.toFixed(4) : rawPrice.toFixed(2);
            const risk = calculateRisk(symbol, rawPrice);
            const multiple = calculateMultiple(symbol, rawPrice);
            const riskColor = getRiskColor(risk);

            const card = document.createElement('div');
            card.className = 'stat-card';
            card.innerHTML = `
                <div class="stat-icon markets" style="color: ${riskColor}; background: ${riskColor}20;">
                    <span style="font-weight:bold; font-size: 0.8rem;">${symbol.toUpperCase()}</span>
                </div>
                <div class="stat-content">
                    <h3>${symbol.toUpperCase()} Price</h3>
                    <p class="stat-value">${displayPrice}</p>
                    <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                        <span class="stat-label">Risk: <span style="color: ${riskColor}">${risk}</span></span>
                        <span class="stat-label">Mult: ${multiple}</span>
                    </div>
                </div>
            `;
            statsGrid.appendChild(card);
        } catch (error) {
            console.error(`Error fetching ${symbol}:`, error);
        }
    }

    // Trigger AI Analysis after getting prices
    generateRiskAnalysis(prices);
}

// Fetch News
let latestNews = [];
async function fetchCryptoNews() {
    // Use Cointelegraph RSS feed via rss2json (Free, no key required)
    const rssUrl = 'https://cointelegraph.com/rss';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    const newsFeed = document.getElementById('news-feed');

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('Failed to fetch RSS feed');
        }

        latestNews = data.items.slice(0, 5);

        newsFeed.innerHTML = latestNews.map(article => `
            <div class="insight-card" onclick="window.open('${article.link}', '_blank')">
                <div class="insight-header">
                    <span class="insight-category">Cointelegraph</span>
                    <span class="insight-time">${new Date(article.pubDate).toLocaleDateString()}</span>
                </div>
                <h3 class="insight-title">${article.title}</h3>
                <p class="insight-summary">${article.description ? article.description.replace(/<[^>]*>/g, '').substring(0, 150) : ''}...</p>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error fetching news:', error);
        newsFeed.innerHTML = '<p style="color: var(--color-text-secondary)">Failed to load news. (RSS Service Unavailable)</p>';
    }
}

// AI Risk Analysis
async function generateRiskAnalysis(prices) {
    const riskContainer = document.getElementById('risk-analysis');
    const newsText = latestNews.map(n => n.title).join('. ');
    const priceText = Object.entries(prices).map(([s, p]) => `${s}: ${p}`).join(', ');

    const prompt = `Analyze the systematic risk based on these crypto prices: ${priceText} and recent news: ${newsText}. Provide a concise risk assessment in HTML format (using <p>, <ul>, <li>, <strong>). Do NOT use markdown code blocks. Focus on market sentiment and potential crash risks.`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer sk-or-v1-YOUR_API_KEY_HERE", // REPLACE WITH ACTUAL KEY
                "HTTP-Referer": window.location.href,
                "X-Title": "Market Intel App",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "alibaba/tongyi-deepresearch-30b-a3b:free",
                "messages": [
                    { "role": "system", "content": "You are a financial risk analyst. Provide concise, actionable systematic risk metrics. Return ONLY HTML. Do not use markdown formatting like ```html." },
                    { "role": "user", "content": prompt }
                ]
            })
        });

        if (response.ok) {
            const data = await response.json();
            let analysis = data.choices[0].message.content;

            // Cleanup markdown if present
            analysis = analysis.replace(/```html/g, '').replace(/```/g, '');

            riskContainer.innerHTML = analysis;
        } else {
            riskContainer.innerHTML = '<p>AI Analysis unavailable (Check API Key).</p>';
        }
    } catch (error) {
        console.error('AI Error:', error);
        riskContainer.innerHTML = '<p>Failed to generate analysis.</p>';
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    updateCryptoData();
    fetchCryptoNews();
});
