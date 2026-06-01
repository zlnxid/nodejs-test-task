const db = require('./connection');

const createTable = () => {
    const sql = 'CREATE TABLE IF NOT EXISTS currencies (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, ticker TEXT NOT NULL UNIQUE)';

    db.run(sql, (err) => {
        if (err) {
            console.error('Ошибка создания таблицы: ', err.message);
        } else {
            console.log('Таблица создана');
        }
    });
};

createTable();
