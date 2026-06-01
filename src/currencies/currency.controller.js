const storage = require('./currency.storage');
const priceService = require('./price.service');

const getAllCurrencies = (req, res) => {
    res.status(200).json(storage.getAll());
};

const getCurrencyById = (req, res) => {

    const currency = storage.getById(req.params.id);

    if (!currency) {
        return res.status(404).json({
            message: "Currency not found"
        });
    }

    res.status(200).json(currency);
};

const createCurrency = (req, res) => {

    const { name, ticker } = req.body;

    if (!name || !ticker) {
        return res.status(400).json({
            message: "Name and ticker are required"
        });
    }

    const currency = storage.create({
        name,
        ticker
    });

    res.status(201).json(currency);
};

const updateCurrency = (req, res) => {

    const currency = storage.update(
        req.params.id,
        req.body
    );

    if (!currency) {
        return res.status(404).json({
            message: "Currency not found"
        });
    }

    res.status(200).json(currency);
};

const deleteCurrency = (req, res) => {

    const deleted = storage.remove(req.params.id);

    if (!deleted) {
        return res.status(404).json({
            message: "Currency not found"
        });
    }

    res.status(204).send();
};

const getPrices = async (req, res) => {

    const { currency } = req.query;

    if (!currency) {
        return res.status(400).json({ message: "Currency is required" });
    }

    const currencies = storage.getAll();

    const exists = currencies.find(
        c => c.ticker.toUpperCase() === currency.toUpperCase()
    );

    if (!exists) {
        return res.status(404).json({ message: "Currency not found" });
    }

    try {
        const prices = await priceService.getPricesByCurrency(currency);
        return res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCurrencies,
    getCurrencyById,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    getPrices
};