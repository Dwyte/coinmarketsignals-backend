const express = require("express");
const serverless = require("serverless-http");
const request = require("request");
const cors = require("cors");
const app = express();
const router = express.Router();


app.use(cors());

router.get("/price", async (req, res) => {
    let url = "https://api.binance.com/api/v3/ticker/price?";
    const {symbol} = req.query;
    if(symbol) url += `symbol=${symbol}`;

    request.get({ url }, (error, response, body) => {
        if(error) return res.send(error);        

        res.send(body);
    });
});

router.get("/klines", async (req, res) => {
    let url = "https://api.binance.com/api/v1/klines?";
    const {symbol, interval, limit} = req.query;
    url += `symbol=${symbol}&interval=${interval}&limit=${limit}`;

    request.get({ url }, (error, response, body) => {
        if(error) return res.send(error);

        res.send(body);
    });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);