const axios = require('axios');

const BINANCE_API_URL = process.env.BINANCE_API_URL;

const getPricesByCurrency = async (ticker) => {

    try {
        const response = await axios.get(
            BINANCE_API_URL,
            { timeout: 5000 }
        );

        const prices = response.data;

        return prices.filter(pair => pair.symbol.includes(ticker.toUpperCase()));

    } catch (error) {
        throw new Error("Failed to fetch prices from Binance");
    }
};

module.exports = {
    getPricesByCurrency
};