const service = require('./currency.service');

const getAllCurrencies = async (req, res) => {
    try {
        const currencies = await service.getAllCurrencies();
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getCurrencyById = async (req, res) => {
    try {
        const currency = await service.getCurrencyById(req.params.id);
        res.status(200).json(currency);
    } catch (error) {
        if (error.message === "Currency not found") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

const createCurrency = async (req, res) => {
    try {
        const {name, ticker} = req.body;
        const currency = await service.createCurrency({name, ticker});
        res.status(201).json(currency);
    } catch (error) {
        if (error.message === "Currency already exists") {
            return res.status(409).json({message: error.message});
        }
        if (error.message === "Name and ticker are required") {
            return res.status(400).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

const updateCurrency = async (req, res) => {
    try {
        const currency = await service.updateCurrency(req.params.id, req.body);
        res.status(200).json(currency);
    } catch (error) {
        if (error.message === "Currency not found") {
            return res.status(404).json({message: error.message});
        }
        if (error.message === "Currency already exists") {
            return res.status(409).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

const deleteCurrency = async (req, res) => {
    try {
        await service.deleteCurrency(req.params.id);
        res.status(204).send();
    } catch (error) {
        if (error.message === "Currency not found") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

const getPrices = async (req, res) => {
    try {
        const {currency} = req.query;
        const prices = await service.getPricesByCurrency(currency);
        return res.status(200).json(prices);
    } catch (error) {
        if (error.message === "Currency is required") {
            return res.status(400).json({message: error.message});
        }
        if (error.message === "Currency not found") {
            return res.status(404).json({message: error.message});
        }
        res.status(500).json({message: error.message});
    }
};

module.exports = {getAllCurrencies, getCurrencyById, createCurrency, updateCurrency, deleteCurrency, getPrices};