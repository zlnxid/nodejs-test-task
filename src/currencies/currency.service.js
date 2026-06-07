const repository = require('./currency.repository');
const priceService = require('./price.service');

class CurrencyService {
    async getAllCurrencies() {
        return await repository.getAll();
    }

    async getCurrencyById(id) {
        const currency = await repository.getById(id);
        if (!currency) {
            throw new Error("Currency not found");
        }
        return currency;
    }

    async createCurrency({name, ticker}) {
        if (!name || !ticker) {
            throw new Error("Name and ticker are required");
        }
        try {
            return await repository.create({name, ticker});
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error("Currency already exists");
            }
            throw error;
        }
    }

    async updateCurrency(id, data) {
        try {
            const currency = await repository.update(id, data);
            if (!currency) {
                throw new Error("Currency not found");
            }
            return currency;
        } catch (error) {
            if (error.message.includes('UNIQUE')) {
                throw new Error("Currency already exists");
            }
            throw error;
        }
    }

    async deleteCurrency(id) {
        const deleted = await repository.remove(id);
        if (!deleted) {
            throw new Error("Currency not found");
        }
    }

    async getPricesByCurrency(currency) {
        if (!currency) {
            throw new Error("Currency is required");
        }
        const currencies = await repository.getAll();
        const exists = currencies.find(c => c.ticker.toUpperCase() === currency.toUpperCase());
        if (!exists) {
            throw new Error("Currency not found");
        }
        return await priceService.getPricesByCurrency(currency);
    }
}

module.exports = new CurrencyService();
