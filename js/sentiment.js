async function loadSentimentData() {
    const ticker = document.getElementById("tickerInput").value.trim().toUpperCase();
    if (!ticker) {
      alert("Please enter a valid stock ticker.");
      return;
    }
  
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "<p>Loading...</p>";
  
    try {
      const apiKey = "QUD9WNKA7NWIVVIO"; // Replace with your actual API key
      const response = await fetch(`https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${ticker}&apikey=${apiKey}`);
      const data = await response.json();
  
      if (!data.feed || data.feed.length === 0) {
        resultsDiv.innerHTML = `<p>No sentiment data found for ${ticker}.</p>`;
        return;
      }
  
      resultsDiv.innerHTML = "";
      data.feed.forEach(item => {
        const div = document.createElement("div");
        div.className = "article";
        div.innerHTML = `
          <h3>${item.title}</h3>
          <a href="${item.url}" target="_blank">Read More</a>
          <p class="meta">Published: ${formatTime(item.time_published)}</p>
          <p class="sentiment">Sentiment: ${item.overall_sentiment_label} (Score: ${item.overall_sentiment_score})</p>
        `;
        resultsDiv.appendChild(div);
      });
    } catch (error) {
      resultsDiv.innerHTML = `<p>Error fetching sentiment data.</p>`;
      console.error(error);
    }
  }
  
  function formatTime(timeStr) {
    const year = timeStr.slice(0, 4);
    const month = timeStr.slice(4, 6);
    const day = timeStr.slice(6, 8);
    const hour = timeStr.slice(9, 11);
    const min = timeStr.slice(11, 13);
    return `${day}-${month}-${year} ${hour}:${min}`;
  }
  