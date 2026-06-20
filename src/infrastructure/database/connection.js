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

const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            resolve(this);
        });
    });
};

const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
};

const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });
};

const transactionAsync = async (callback) => {
    try {
        await runAsync('BEGIN TRANSACTION');
        await callback();
        await runAsync('COMMIT');
    } catch (err) {
        await runAsync('ROLLBACK');
        throw err;
    }
};

module.exports = {
    db,
    runAsync,
    getAsync,
    allAsync,
    transactionAsync
};
