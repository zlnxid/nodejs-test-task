const db = require('../infrastructure/database/connection');
const createLogger = require('../common/utils/logger');
const { transactionAsync, runAsync, getAsync, allAsync } = require('../infrastructure/database/connection');
const log = createLogger("CurrencyRepository");

class CurrencyRepository {
    async getAll() {
        try {
            return await allAsync('SELECT * FROM currencies');
        } catch (err) {
            log.error('Ошибка при получении всех валют: ', err.message);
            throw err;
        }
    }

    async getById(id) {
        try {
            return await getAsync('SELECT * FROM currencies WHERE id = ?', [id]);
        } catch (err) {
            log.error('Ошибка при получении валюты по id: ', err.message);
            throw err;
        }
    }

    async create({name, ticker}) {
        try {
            let result;
            await transactionAsync(async () => {
                const sql = 'INSERT INTO currencies (name, ticker) VALUES (?, ?)';
                result = await runAsync(sql, [name, ticker]);
            });
            log.info('Валюта создана');
            return {id: result.lastID, name, ticker};
        } catch (err) {
            log.error('Ошибка при создании валюты: ', err.message);
            throw err;
        }
    }

    async update(id, data) {
        try {
            const row = await getAsync('SELECT * FROM currencies WHERE id = ?', [id]);
            if (!row) {
                log.info('Валюта не найдена');
                return null;
            }
            const updateName = data.name ?? row.name;
            const updateTicker = data.ticker ?? row.ticker;

            await transactionAsync(async () => {
                const sql = 'UPDATE currencies SET name = ?, ticker = ? WHERE id = ?';
                await runAsync(sql, [updateName, updateTicker, id]);
            });

            log.info('Валюта обновлена');
            return {id: Number(id), name: updateName, ticker: updateTicker};
        } catch (err) {
            log.error('Ошибка при обновлении валюты: ', err.message);
            throw err;
        }
    }

    async remove(id) {
        try {
            let result;
            await transactionAsync(async () => {
                result = await runAsync('DELETE FROM currencies WHERE id = ?', [id]);
            });
            log.info('Валюта c id ' + id + ' удалена');
            return result.changes > 0;
        } catch (err) {
            log.error('Ошибка при удалении валюты: ', err.message);
            throw err;
        }
    }

    async clear() {
        try {
            await transactionAsync(async () => {
                await runAsync('DELETE FROM currencies');
            });
            log.info('Все валюты удалены');
        } catch (err) {
            log.error('Ошибка при удалении всех валют: ', err.message);
            throw err;
        }
    }
}

module.exports = new CurrencyRepository();
