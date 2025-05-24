let chart;

function setTicker(ticker) {
  document.getElementById('tickerInput').value = ticker;
}

async function fetchHistoricalData(ticker, range, interval) {
  try {
    const response = await fetch(`https://yfin-api-9dz9.onrender.com/stock/${ticker}/history?range=${range}&interval=${interval}`);
    if (!response.ok) throw new Error("API error");
    const apiData = await response.json();
    return apiData.data.map(entry => ({
      time: new Date(entry.date).toLocaleDateString('en-IN'),
      price: entry.close
    }));
  } catch (error) {
    alert("Failed to fetch data.");
    console.error("Fetch error:", error);
    return [];
  }
}

async function loadHistoricalData() {
  const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
  const range = document.getElementById('rangeSelector').value;
  const interval = document.getElementById('intervalSelector').value;

  if (!ticker) {
    alert("Please enter a valid ticker.");
    return;
  }

  const stockData = await fetchHistoricalData(ticker, range, interval);
  if (stockData.length === 0) return;

  const timeLabels = stockData.map(d => d.time);
  const prices = stockData.map(d => d.price);

  const ctx = document.getElementById('stockChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: `${ticker} Stock Price (${interval})`,
        data: prices,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      animation: false,
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    }
  });
}
