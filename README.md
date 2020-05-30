# coinBot9000
Discord bot to provide the current & historical prices of various crypto-currencies using the coinbase API, along with [discord.js](https://github.com/discordjs/discord.js)
to receive & send messages to the server, in order to receive request for price information and send a response.

Currently all prices are displyed in GBP, other currencies may be included in the future

<h1>Commands</h1>
<p><b>?btc</b> - Requests the current spot price of Bitcoin<p>
<p><b>?btc 1w</b> - Requests the spot price of Bitcoin 1 week ago. Can be foramtted as n{d, w, m, y}<p>

<h1>Usage</h1>
<p>All that is required before deploying the bot is the creation of a .env file in the project directory </p>

<code># .env</code>
<br />
<code>TOKEN = 'API key'</code>
