# 📈 Crypto Api Widgets

This repository hosts simple **HTML/JavaScript** demos showcasing how to interact with the public APIs of popular cryptocurrency exchanges and data providers. This project is intended to serve as a quick starting point for developers looking to access crypto market data.

---

## 🌟 Features
https://madenix.github.io/Crypto-Api-Widgets/

* **Diversity:** Includes integration examples for several major platforms:
    * **CoinGecko** (Data Provider)
    * **Binance** (Exchange)
* **Simplicity:** Each demo uses plain **HTML**, **CSS**, and **JavaScript**, requiring no complex setup or server dependencies.
* **Quick Learning:** Clearly demonstrates how to make API calls and render the incoming data on a webpage.

---

## 🛠️ Setup and Running the Demos

Running these examples is straightforward.

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/Public-Crypto-API-Reference.git](https://github.com/YOUR_USERNAME/Public-Crypto-API-Reference.git)
    cd Public-Crypto-API-Reference
    ```
2.  **Navigate to a Demo Folder:**
    Go into the folder of the API you wish to inspect (e.g., `coingecko-demo/`).
3.  **Open in Browser:**
    Open the `index.html` file directly in your preferred web browser (Chrome, Firefox, etc.).
    * *Alternatively, you can use an extension like "Live Server" in VS Code for live reloading support.*

---

## 📁 Project Structure

Each API has its own isolated folder. If you can't find a specific folder, file, or code snippet, it means that component has not been written or implemented yet.

Public-Crypto-API-Reference/<br/>
├── README.md<br/>
├── coingecko/              <br/>
│   ├── index.html          <br/>
│   ├── coingecko.js        <br/>
├── binance/                <br/>
│   ├── index.html          <br/>
│   └── binance.js          <br/>

---

## 🔑 Important Notes (API Keys)

* Since most demos in this repository use **public API endpoints**, an **API key is usually not required**. For instance, endpoints used to retrieve current prices are generally public.
* Some platforms might require an **API Key** even for some free-tier endpoints. If a demo doesn't work, check the `*.js` file to see if you need to insert your own key.
* **Sensitive Data:** This project should **NEVER** contain **private API keys, secrets, or sensitive user information**. All API calls must target public data that can be safely displayed in the browser.

  For more information visit www.madenix.com
