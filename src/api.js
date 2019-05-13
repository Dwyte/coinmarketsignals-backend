const express = require("express");
const serverless = require("serverless-http");
const request = require("request-promise");
const cors = require("cors");
const app = express();
const router = express.Router();

const result = require("./tools/rsiTool");


app.use(cors());

router.get("/price", async (req, res) => {
    let url = "https://api.binance.com/api/v3/ticker/price?";
    const {symbol} = req.query;
    if(symbol) url += `symbol=${symbol}`;

    res.send(await request.get(url));
});

router.get("/klines", async (req, res) => {
    let url = "https://api.binance.com/api/v1/klines?";
    const {symbol, interval, limit} = req.query;
    url += `symbol=${symbol}&interval=${interval}&limit=${limit}`;

    res.send(await request.get(url));
});

router.get("/bookTicker", async (req, res) => {
    let url = "https://api.binance.com/api/v3/ticker/bookTicker";

    res.send(await request.get(url));
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);