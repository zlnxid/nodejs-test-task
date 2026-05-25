const storage = require('./currency.storage');

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

module.exports = {
    getAllCurrencies,
    getCurrencyById,
    createCurrency,
    updateCurrency,
    deleteCurrency
};