const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const createLogger = require('../../common/utils/logger');
const log = createLogger("Database");

const dbPath = path.join(__dirname, './currency.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        log.error('Ошибка подключения к БД: ', err.message);
    } else {
        log.info('Подключение к БД установлено');
    }
});

module.exports = db;
