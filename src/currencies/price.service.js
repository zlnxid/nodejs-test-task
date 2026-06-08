const priceRepository = require("./price.repository");
const createLogger = require("../common/utils/logger");
const logger = createLogger("PriceService");

const getPricesByCurrency = async (ticker) => {

    try {
        const prices = await priceRepository.getPricesByTicker(ticker);

        if (prices.length === 0) {
            logger.warn(`Курсы для валюты ${ticker} не найдены`);
            return [];
        }

        return prices.map(p => ({
            symbol: p.symbol,
            price: p.price
        }));

    } catch (error) {
        logger.error(`Ошибка при получении курсов валют из БД: ${error.message}`);
        throw error;
    }
};

module.exports = {
    getPricesByCurrency
};