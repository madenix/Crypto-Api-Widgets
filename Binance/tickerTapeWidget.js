/*
use this script in an html file with like;
<script src="tickerTapeWidget.js" data-bases="btc,xrp,ltc,ada" data-quote="usdt"></script>

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


mainDiv
├── contentDiv (1)
│    ├── symbolDiv (1)
│    ├── symbolDiv (2)
│    └── symbolDiv (3)
|    .
|		 .
|		 .
│
└── contentDiv (2)
		├── symbolDiv (1)
		├── symbolDiv (2)
		└── symbolDiv (3)
		.
		.
		.
*/
function tickerTapeStyle(){
	var style = document.createElement('style');
	style.innerHTML = `
    #tickerTapeMain {
        height: 50px;
        display:flex;
        overflow: hidden;
        white-space: nowrap;
    }
    
    #tickerTapeConentDiv {
        display: flex;
        align-items: center;      
        animation-duration: 15s;
        animation-iteration-count: infinite;
        animation-name: scroll;
        animation-timing-function: linear;
        padding-right: 50px;
    }

    @keyframes scroll {
      from {
        transform: translateX( 0% );
      }
      to {
        transform: translateX( -100% );
      }
    }

    #tickerTapeMain:hover #tickerTapeConentDiv {
        animation-play-state: paused;
    }
  `;
  document.head.appendChild(style);
}

(function(){
	tickerTapeStyle();
  const script = document.currentScript;

  // Create the main container for the ticker tape
  const mainDiv = document.createElement("div");
  mainDiv.id = "tickerTapeMain";
  //document.body.appendChild(mainDiv);
  (script.parentNode || document.body).insertBefore(mainDiv, script);

  // Create the inner content container
  const contentDiv1 = document.createElement("div");
  contentDiv1.id = "tickerTapeConentDiv";

	const contentDiv2 = contentDiv1.cloneNode(true);
	const contentDiv3 = contentDiv1.cloneNode(true);

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
		price = price > 1 ? price.toFixed(2) : price; 
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
				nameSpan.style.marginLeft = "5px";
				nameSpan.innerHTML = "<b>" + symbol + "</b>";

				const priceSpan = document.createElement("span");
				priceSpan.style.marginLeft = "5px";
				priceSpan.textContent = price;

				const changeSpan = document.createElement("span");
				changeSpan.style.color = color;
				changeSpan.style.marginLeft = "5px";
				changeSpan.textContent = arrow + change;

				const symbolDiv = document.createElement("div");
				symbolDiv.style.display = "flex";
				symbolDiv.style.alignItems = "center";
				symbolDiv.style.padding = "5px";
				symbolDiv.style.marginLeft = "30px";

				symbolDiv.appendChild(logo);
				symbolDiv.appendChild(nameSpan);
				symbolDiv.appendChild(priceSpan);
				symbolDiv.appendChild(changeSpan);

				return {symbolDiv, priceSpan, changeSpan};
			}

			const div1 = createSymbolDiv();
			const div2 = createSymbolDiv();
			const div3 = createSymbolDiv();

			contentDiv1.appendChild(div1.symbolDiv);
			contentDiv2.appendChild(div2.symbolDiv);
			contentDiv3.appendChild(div3.symbolDiv);

			// Cache price span references for all containers
			cache[symbol] = {
				priceSpans: [div1.priceSpan, div2.priceSpan, div3.priceSpan],
				changeSpans: [div1.changeSpan, div2.changeSpan, div3.changeSpan]
			};

		} else {
			// Güncelleme: tüm priceSpan’leri güncelle
			cache[symbol].priceSpans.forEach(span => span.textContent = price);
			cache[symbol].changeSpans.forEach(span => span.textContent = arrow + change);
		}
  } // onmessage

	mainDiv.appendChild(contentDiv1);
	mainDiv.appendChild(contentDiv2);
	mainDiv.appendChild(contentDiv3);
})();
