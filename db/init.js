const db = require('./connection');
const createLogger = require('../src/common/utils/logger');
const log = createLogger("DatabaseInit");

const createTable = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)';

    db.run(sql, (err) => {
        if (err) {
            log.error('Ошибка создания таблицы: ', err.message);
        } else {
            log.info('Таблица создана');
        }
    });
};

createTable();
