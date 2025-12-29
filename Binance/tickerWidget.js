//this is a IIFE 
/*
example usage
<script src="tickerWidget.js" data-base="btc" data-quote="usdt"></script>
*/

(function() {
  // Get the current script tag that loaded this JS
  const script = document.currentScript;

  // Read custom data attributes from the script tag
  const base = script.getAttribute("data-base");   // Base currency, e.g., "btc"
  const quote = script.getAttribute("data-quote"); // Quote currency, e.g., "usdt"

  /*
      Binance WebSocket 24hr Ticker Stream Example
      --------------------------------------------
      Raw streams:       /ws/<streamName>
      Combined streams:  /stream?streams=<streamName1>/<streamName2>/...

      Sample data payload (for one symbol):
      {
        "e": "24hrTicker",  // Event type
        "E": 1672515782136, // Event timestamp
        "s": "BNBBTC",      // Symbol
        "p": "0.0015",      // Price change
        "P": "250.00",      // Price change percentage
        "w": "0.0018",      // Weighted average price
        "x": "0.0009",      // First trade price in 24h window
        "c": "0.0025",      // Last price
        "Q": "10",          // Last quantity
        "b": "0.0024",      // Best bid price
        "B": "10",          // Best bid quantity
        "a": "0.0026",      // Best ask price
        "A": "100",         // Best ask quantity
        "o": "0.0010",      // Open price
        "h": "0.0025",      // High price
        "l": "0.0010",      // Low price
        "v": "10000",       // Total traded base asset volume
        "q": "18",          // Total traded quote asset volume
        "O": 0,             // Statistics open time
        "C": 86400000,      // Statistics close time
        "F": 0,             // First trade ID
        "L": 18150,         // Last trade ID
        "n": 18151          // Total number of trades
      }
  */

  // Construct the Binance WebSocket URL for the 24hr ticker
  const tickerUrl = "wss://stream.binance.com:9443/ws/" + base + quote + "@ticker";

  // Open WebSocket connection
  const tickerSocket = new WebSocket(tickerUrl);
  // Create a container div for the ticker
  var tickerElement = document.createElement("div");
  //document.body.appendChild(tickerElement); // Append container to the page
  (script.parentNode || document.body).insertBefore(tickerElement, script);
  tickerElement.style.display = "inline-block";
  tickerElement.style.border = "1px solid #ccc";
  tickerElement.style.borderRadius = "5px";
  tickerElement.style.padding = "5px";
  
  // Create a div for the logo and symbol
  var logoDiv = document.createElement("div");
  const logo = "<img src='https://cdn.jsdelivr.net/gh/madenix/Crypto-logo-cdn@main/Logos/" + base.toUpperCase() + ".svg' width='64' />";
  const symbol = base.toUpperCase() + "/" + quote.toUpperCase();
  logoDiv.innerHTML = logo + symbol;

  // Style the logo + symbol container
  logoDiv.style.display = "flex";         
  logoDiv.style.alignItems = "center";    
  logoDiv.style.gap = "16px";             
  logoDiv.style.fontSize = "1.2rem";
  logoDiv.style.fontWeight = "600";
  logoDiv.style.margin = "10px 0";
  tickerElement.appendChild(logoDiv);

  // Create a div for the live price
  var priceDiv = document.createElement("div");
  tickerElement.appendChild(priceDiv);
  priceDiv.style.fontSize = "1.5rem";
  priceDiv.style.fontWeight = "1000";

  // Create a div for the daily percent change
  var dailyChangeDiv = document.createElement("div");
  tickerElement.appendChild(dailyChangeDiv);

  // Listen for incoming WebSocket messages
  tickerSocket.onmessage = (event) => {
    // Parse the JSON data from Binance
    const data = JSON.parse(event.data);
    
    // Update the last price
    let price = parseFloat(data.c);
    price = price > 1 ? price.toFixed(2) : price; 
    priceDiv.innerHTML = "$" + price;
    
    // Update the daily percent change
    let change = parseFloat(data.P);
    const arrow = change >= 0 ? "▲" : "▼";     // Up or down arrow
    const color = change >= 0 ? "green" : "red";  
    change = Math.abs(change).toFixed(2);     
    
    dailyChangeDiv.style.color = color;
    dailyChangeDiv.innerHTML = arrow + change;
  };

  // Optional: handle WebSocket errors
  tickerSocket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

})();
