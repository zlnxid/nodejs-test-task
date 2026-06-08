const db = require('./connection');
const createLogger = require('../../common/utils/logger');
const log = createLogger("DatabaseInit");

const createTable = () => {
    const sqlCurrencies = 'CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)';

    db.run(sqlCurrencies, (err) => {
        if (err) {
            log.error('Ошибка создания таблицы currencies: ', err.message);
        } else {
            log.info('Таблица currencies создана');
        }
    });

    const sqlPrices = 'CREATE TABLE IF NOT EXISTS prices (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, price TEXT NOT NULL, currency_id INTEGER NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (currency_id) REFERENCES currencies(id))';

    db.run(sqlPrices, (err) => {
        if (err) {
            log.error('Ошибка создания таблицы prices: ', err.message);
        } else {
            log.info('Таблица prices создана');
        }
    });
};

createTable();
