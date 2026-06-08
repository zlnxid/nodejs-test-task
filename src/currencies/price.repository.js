const db = require('../infrastructure/database/connection');
const createLogger = require('../common/utils/logger');
const log = createLogger("PriceRepository");

class PriceRepository {

    async savePrice(symbol, price, currencyId) {
        return new Promise( (resolve, reject) => {
            const sql = `INSERT INTO prices (symbol, price, currency_id, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(symbol) DO UPDATE SET price = excluded.price, updated_at = CURRENT_TIMESTAMP`;
            db.run(sql, [symbol, price, currencyId], function (err) {
                if (err) {
                    log.error('Ошибка при сохранении цены: ', err.message);
                    reject(err);
                } else {
                    log.info(`Цена сохранена: ${symbol} = ${price}`);
                    resolve({id: this.lastID, symbol, price, currencyId});
                }
            });
        });
    }

    async getPricesById(currencyId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM prices WHERE currency_id = ?';
            db.all(sql, [currencyId], (err, rows) => {
                if (err) {
                    log.error('Ошибка при получении цен по currency_id: ', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getPricesByTicker(ticker) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT p.* FROM prices p JOIN currencies c ON p.currency_id = c.id WHERE c.ticker = ?`;
            db.all(sql, [ticker.toUpperCase()], (err, rows) => {
                if (err) {
                    log.error('Ошибка при получении цен по ticker: ', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }

    async clear() {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM prices', (err) => {
                if (err) {
                    log.error('Ошибка при удалении всех курсов валют: ', err.message);
                    reject(err);
                } else {
                    log.info('Все курсы валют удалены');
                    resolve();
                }
            });
        });
    }
}

module.exports = new PriceRepository();
