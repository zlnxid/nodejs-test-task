const axios = require('axios');
const currencyRepository = require('../currencies/currency.repository');
const priceRepository = require('../currencies/price.repository');
const createLogger = require('../common/utils/logger');
const log = createLogger("UpdatePricesTask");

const BINANCE_API_URL = process.env.BINANCE_API_URL;

const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

const updatePriceTask = async () => {
    try {
        const currencies = await currencyRepository.getAll();
        if (currencies.length === 0) {
            log.info('Нет валют для обновления');
            return;
        }

        const maxRetries = 3;
        let binancePrices = [];

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await axios.get(BINANCE_API_URL, {timeout: 5000});
                binancePrices = response.data;
                log.info(`Получено ${binancePrices.length} ценовых пар с Binance`);
                break;
            } catch (error) {
                log.error(`Ошибка при получении ценовых пар с Binance (попытка ${attempt}): ${error.message}`);
                if (attempt === maxRetries) {
                    throw new Error('Не удалось получить ценовые пары с Binance');
                }
                await delay(1000);
            }
        }

        for (const currency of currencies) {
            const ticker = currency.ticker.toUpperCase();

            const matchingPairs = binancePrices.filter(pair => pair.symbol.includes(ticker));

            if (matchingPairs.length === 0) {
                log.warn(`Нет соответствующих ценовых пар для валюты ${currency.name} (${currency.ticker})`);
                continue;
            }

            for (const pair of matchingPairs) {
                await priceRepository.savePrice(
                    pair.symbol,
                    pair.price,
                    currency.id
                );
            }

            log.info(`Обновлено ${matchingPairs.length} пар для валюты: ${ticker}`);
        }
    } catch (error) {
        log.error(`Ошибка в фоновой задаче обновления цен: ${error.message}`);
    }
};

module.exports = updatePriceTask;