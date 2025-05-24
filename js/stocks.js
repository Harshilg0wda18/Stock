let chart;
let intervalId = null;
let currentTicker = '';
let priceHistory = [];
let timeLabels = [];
let lastTime = new Date(); // Initialize to current time

function setTicker(ticker) {
  document.getElementById('tickerInput').value = ticker;
  loadStock();
}

async function fetchStockData(ticker) {
  const response = await fetch(`http://localhost:3001/stock/${ticker}`);
  const data = await response.json();

  // Increment time by 1 minute
  lastTime = new Date(lastTime.getTime() + 60000);

  const formattedTime = lastTime.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return {
    price: data.price,
    time: formattedTime
  };
}

async function loadStock() {
  const ticker = document.getElementById('tickerInput').value.trim().toUpperCase();
  if (!ticker) {
    alert("Please enter a valid ticker.");
    return;
  }

  currentTicker = ticker;
  priceHistory = [];
  timeLabels = [];

  lastTime = new Date(); // Reset time for this stock

  const { price, time } = await fetchStockData(ticker);
  priceHistory.push(price);
  timeLabels.push(time);

  const ctx = document.getElementById('stockChart').getContext('2d');

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: `${ticker} Stock Price`,
        data: priceHistory,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14
            }
          }
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: 'Price (USD)'
          }
        }
      }
    }
  });

  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(updateChart, 60000); // every minute
}

async function updateChart() {
  if (!currentTicker || !chart) return;

  const { price, time } = await fetchStockData(currentTicker);

  priceHistory.push(price);
  timeLabels.push(time);

  chart.data.labels = timeLabels;
  chart.data.datasets[0].data = priceHistory;
  chart.update();
}
