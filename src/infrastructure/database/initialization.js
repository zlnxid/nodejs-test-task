const db = require('./connection');
const createLogger = require('../../common/utils/logger');
const {runAsync, transactionAsync} = require("./connection");
const log = createLogger("DatabaseInit");

const createTable = async () => {
    try {
        await transactionAsync(async () => {
            const sqlCurrencies = 'CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)';
            await runAsync(sqlCurrencies);
            const sqlPrices = 'CREATE TABLE IF NOT EXISTS prices (id INTEGER PRIMARY KEY AUTOINCREMENT, symbol TEXT NOT NULL UNIQUE, price TEXT NOT NULL, currency_id INTEGER NOT NULL, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (currency_id) REFERENCES currencies(id))';
            await runAsync(sqlPrices);
        });
        log.info('Таблицы созданы');
    } catch (err) {
        log.error('Ошибка создания таблиц: ', err.message);
        throw err;
    }
};

module.exports = createTable;
