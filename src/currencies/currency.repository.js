const db = require('../../db/connection');
const createLogger = require('../common/utils/logger');
const log = createLogger("CurrencyRepository");

class CurrencyRepository {
    async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM currencies', (err, rows) => {
                if (err) {
                    log.error('Ошибка при получении всех валют: ', err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM currencies WHERE id = ?', [id], (err, row) => {
                if (err) {
                    log.error('Ошибка при получении валюты по id: ', err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async create({name, ticker}) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                const sql = 'INSERT INTO currencies (name, ticker) VALUES (?, ?)';
                db.run(sql, [name, ticker], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        log.error('Ошибка при создании валюты: ', err.message);
                        reject(err);
                    } else {
                        db.run('COMMIT');
                        log.info('Валюта создана');
                        resolve({id: this.lastID, name, ticker});
                    }
                });
            });
        });
    }

    async update(id, data) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.get('SELECT * FROM currencies WHERE id = ?', [id], (err, row) => {
                    if (err) {
                        db.run('ROLLBACK');
                        log.error('Ошибка при обновлении валюты: ', err.message);
                        reject(err);
                    } else if (!row) {
                        db.run('ROLLBACK');
                        log.info('Валюта не найдена');
                        resolve(null);
                    } else {
                        const updateName = data.name ?? row.name;
                        const updateTicker = data.ticker ?? row.ticker;
                        const sql = 'UPDATE currencies SET name = ?, ticker = ? WHERE id = ?';
                        db.run(sql, [updateName, updateTicker, id], function (err) {
                            if (err) {
                                db.run('ROLLBACK');
                                log.error('Ошибка при обновлении валюты: ', err.message);
                                reject(err);
                            } else {
                                db.run('COMMIT');
                                log.info('Валюта обновлена');
                                resolve({id: Number(id), name: updateName, ticker: updateTicker});
                            }
                        });
                    }
                });
            });
        });
    }

    async remove(id) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM currencies WHERE id = ?', [id], function (err) {
                    if (err) {
                        db.run('ROLLBACK');
                        log.error('Ошибка при удалении валюты: ', err.message);
                        reject(err);
                    } else {
                        db.run('COMMIT');
                        log.info('Валюта c id ' + id + ' удалена');
                        resolve(this.changes > 0);
                    }
                });
            });
        });
    }

    async clear() {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');
                db.run('DELETE FROM currencies', (err) => {
                    if (err) {
                        db.run('ROLLBACK');
                        log.error('Ошибка при удалении всех валют: ', err.message);
                        reject(err);
                    } else {
                        db.run('COMMIT');
                        log.info('Все валюты удалены');
                        resolve();
                    }
                });
            });
        })
    }
}

module.exports = new CurrencyRepository();
