const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'currencies.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к БД: ', err.message);
    } else {
        console.log('Подключение к БД установлено');
    }
});

module.exports = db;
