const axios = require('axios');

const createLogger = require("../logger");
const logger = createLogger("PriceService");

const BINANCE_API_URL = process.env.BINANCE_API_URL;

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const getPricesByCurrency = async (ticker) => {

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {

            const response = await axios.get(
                BINANCE_API_URL,
                {timeout: 5000}
            );

            const prices = response.data;

            return prices.filter(pair => pair.symbol.includes(ticker.toUpperCase()));

        } catch (error) {

            logger.error(`Binance request failed. Attempt ${attempt}`);

            if (attempt === maxRetries) {
                throw new Error("Failed to fetch prices from Binance");
            }

            await delay(1000);
        }
    }
};

module.exports = {
    getPricesByCurrency
};