const repository = require('./currency.repository');
const priceService = require('./price.service');

const getAllCurrencies = async (req, res) => {
    try {
        const currencies = await repository.getAll();
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getCurrencyById = async (req, res) => {
    try {
        const currency = await repository.getById(req.params.id);
        if (!currency) {
            return res.status(404).json({message: "Currency not found"});
        }

        res.status(200).json(currency);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createCurrency = async (req, res) => {
    try {
        const {name, ticker} = req.body;

        if (!name || !ticker) {
            return res.status(400).json({message: "Name and ticker are required"});
        }
        const currency = await repository.create({name, ticker});
        res.status(201).json(currency);
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(409).json({message: "Currency already exists"});
        }
        res.status(500).json({message: error.message});
    }
};

const updateCurrency = async (req, res) => {
    try {
        const currency = await repository.update(req.params.id, req.body);

        if (!currency) {
            return res.status(404).json({message: "Currency not found"});
        }

        res.status(200).json(currency);
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(409).json({message: "Currency already exists"});
        }
        res.status(500).json({message: error.message});
    }
};

const deleteCurrency = async (req, res) => {
    try {
        const deleted = await repository.remove(req.params.id);

        if (!deleted) {
            return res.status(404).json({message: "Currency not found"});
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPrices = async (req, res) => {
    try {
        const {currency} = req.query;

        if (!currency) {
            return res.status(400).json({message: "Currency is required"});
        }

        const currencies = await repository.getAll();
        const exists = currencies.find(c => c.ticker.toUpperCase() === currency.toUpperCase());
        if (!exists) {
            return res.status(404).json({message: "Currency not found"});
        }

        try {
            const prices = await priceService.getPricesByCurrency(currency);
            return res.status(200).json(prices);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {getAllCurrencies, getCurrencyById, createCurrency, updateCurrency, deleteCurrency, getPrices};