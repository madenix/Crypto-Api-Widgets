/*
use this script in an html file with like;
<script src="tickerList.js" data-bases="btc,xrp,ltc,ada" data-quote="usdt"></script>

-The base endpoint is: wss://stream.binance.com:9443 or wss://stream.binance.com:443.
-Streams can be accessed either in a single raw stream or in a combined stream.
-Raw streams are accessed at /ws/<streamName>
-Combined streams are accessed at /stream?streams=<streamName1>/<streamName2>/<streamName3>
-All symbols for streams are lowercase

For more info visit : 
https://developers.binance.com/docs/binance-spot-api-docs/web-socket-streams"

Notes:
	***It listens to the Individual Symbol Ticker Stream for one or multiple symbols.
	- 24hr rolling window ticker statistics for each symbol.
	- These are NOT the statistics of the UTC day, but the last 24 hours.
	- Stream format: <symbol>@ticker
	- Update speed: 1000ms (1 second)
	- Payload example for a single symbol:
	
	{
	  "e": "24hrTicker",  // Event type
	  "E": 1672515782136, // Event time
	  "s": "BNBBTC",      // Symbol
	  "p": "0.0015",      // Price change
	  "P": "250.00",      // Price change percent
	  "w": "0.0018",      // Weighted average price
	  "x": "0.0009",      // First trade price before 24h window
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
(function(){
  const script = document.currentScript;

  // Create the main container for the ticker tape
  const mainDiv = document.createElement("div");
  mainDiv.id = "tickerList";
  
  // Header row
const headerDiv = document.createElement("div");
headerDiv.style.display = "flex";
headerDiv.style.alignItems = "center";
headerDiv.style.padding = "5px";
headerDiv.style.fontWeight = "bold";
headerDiv.style.borderBottom = "1px solid #ccc";

// Boş logo alanı
const empty = document.createElement("span");
empty.style.width = "25px";

// İsim
const nameHeader = document.createElement("span");
nameHeader.textContent = "Name";
nameHeader.style.width = "20%";
nameHeader.style.paddingLeft = "15px";

// Fiyat
const priceHeader = document.createElement("span");
priceHeader.textContent = "Price";
priceHeader.style.width = "40%";
priceHeader.style.padding = "5px";

// 24h Değişim
const changeHeader = document.createElement("span");
changeHeader.textContent = "24h %";
changeHeader.style.width = "20%";
changeHeader.style.padding = "5px";

// Header’a ekle
headerDiv.appendChild(empty);
headerDiv.appendChild(nameHeader);
headerDiv.appendChild(priceHeader);
headerDiv.appendChild(changeHeader);

headerDiv.style.position = "sticky";
headerDiv.style.top = "0";
headerDiv.style.zIndex = "10";
headerDiv.style.backdropFilter = "blur(10px)";

// En üste koy
mainDiv.appendChild(headerDiv);

  (script.parentNode || document.body).insertBefore(mainDiv, script);

  const socketUrl = "wss://stream.binance.com:9443/stream?streams=";
  
  let bases = script.getAttribute("data-bases");
  bases = bases.split(',');

  const quote = script.getAttribute("data-quote");

  // Prepare the WebSocket streams for all base symbols
  const streams = bases.map(base => base + quote + "@ticker").join('/');
  const wsUrl = socketUrl + streams;
  
  const ws = new WebSocket(wsUrl);
  
  // WebSocket connection events
  ws.onopen = () => console.log("WebSocket connected:", wsUrl);
  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = err => console.error("WebSocket error:", err);
  
  // Cache to store DOM references for each symbol
  const cache = {}; 
  
  ws.onmessage = (message) => {
    const payload = JSON.parse(message.data);

    let price = parseFloat(payload.data.c);
    price = price > 1 ? price.toFixed(2) : price.toFixed(6);
		price = "$" + price;
    
		const symbol = payload.data.s.slice(0, -quote.length);
    
		let change = payload.data.P;
    
		const arrow = change >= 0 ? "▲" : "▼";
    const color = change >= 0 ? "green" : "red";
    
		change = Math.abs(change).toFixed(2);

		if(!cache[symbol]){
			const logoUrl = "https://cdn.jsdelivr.net/gh/madenix/Crypto-logo-cdn@main/Logos/" + symbol + ".svg";  

			function createSymbolDiv() {
				const logo = document.createElement("img");
				logo.src = logoUrl;
				logo.width = 25;
				logo.height = 25;

				const nameSpan = document.createElement("span");
				nameSpan.innerHTML = "<b>" + symbol + "</b>";
				nameSpan.style.width = "20%";

				const priceSpan = document.createElement("span");
				priceSpan.textContent = price;
				priceSpan.style.padding = '5px';
				priceSpan.style.width = "40%";
				nameSpan.style.paddingLeft = '15px';

				const changeSpan = document.createElement("span");
				changeSpan.style.color = color;
				changeSpan.textContent = arrow + change + "%";
				changeSpan.style.padding = "5px";
				changeSpan.style.width = "20%";

				const symbolDiv = document.createElement("div");
				symbolDiv.style.display = "flex";
				symbolDiv.style.alignItems = "center";
				symbolDiv.style.padding = "5px";

        symbolDiv.appendChild(logo);
				symbolDiv.appendChild(nameSpan);
				symbolDiv.appendChild(priceSpan);
				symbolDiv.appendChild(changeSpan);

				return {symbolDiv, priceSpan, changeSpan};
			}
			const row = createSymbolDiv();

			mainDiv.appendChild(row.symbolDiv);
			mainDiv.style.fontSize = 'clamp(0.875rem, 1vw, 1rem)';

			// Cache price span references for all containers
			cache[symbol] = {
				priceSpans: [row.priceSpan],
				changeSpans: [row.changeSpan]
			};

		} else {
			// Güncelleme: tüm priceSpan’leri güncelle
			cache[symbol].priceSpans.forEach(span => span.textContent = price);
			cache[symbol].changeSpans.forEach(span => {span.textContent = arrow + change + "%";span.style.color = color;});
		}
  } // onmessage
})();
