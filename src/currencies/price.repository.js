const db = require('../infrastructure/database/connection');
const createLogger = require('../common/utils/logger');
const {runAsync, allAsync} = require("../infrastructure/database/connection");
const log = createLogger("PriceRepository");

class PriceRepository {

    async savePrice(symbol, price, currencyId) {
        try {
            const sql = `INSERT INTO prices (symbol, price, currency_id, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(symbol) DO UPDATE SET price = excluded.price, updated_at = CURRENT_TIMESTAMP`;
            const result = await runAsync(sql, [symbol, price, currencyId]);
            log.info(`Цена сохранена: ${symbol} = ${price}`);
            return {id: result.lastID, symbol, price, currencyId};
        } catch (err) {
            log.error('Ошибка при сохранении цены: ', err.message);
            throw err;
        }
    }

    async getPricesById(currencyId) {
        try {
            return await allAsync('SELECT * FROM prices WHERE currency_id = ?', [currencyId]);
        } catch (err) {
            log.error('Ошибка при получении цен по currency_id: ', err.message);
            throw err;
        }
    }

    async getPricesByTicker(ticker) {
        try {
            return await allAsync('SELECT p.* FROM prices p JOIN currencies c ON p.currency_id = c.id WHERE c.ticker = ?', [ticker.toUpperCase()]);
        } catch (err) {
            log.error('Ошибка при получении цен по ticker: ', err.message);
            throw err;
        }
    }

    async clear() {
        try {
            await runAsync('DELETE FROM prices');
            log.info('Все курсы валют удалены');
        } catch (err) {
            log.error('Ошибка при удалении всех курсов валют: ', err.message);
            throw err;
        }
    }
}

module.exports = new PriceRepository();
