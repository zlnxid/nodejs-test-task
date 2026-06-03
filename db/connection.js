const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const createLogger = require('../src/common/utils/logger');
const dbPath = path.join(__dirname, 'currencies.db');

const log = createLogger("Database");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        log.error('Ошибка подключения к БД: ', err.message);
    } else {
        log.info('Подключение к БД установлено');
    }
});

module.exports = db;
