let currencies = [];
let currentId = 1;

const getAll = () => currencies;

const getById = (id) => {
    return currencies.find(c => c.id === Number(id));
};

const create = ({ name, ticker }) => {
    const currency = {
        id: currentId++,
        name,
        ticker
    };

    currencies.push(currency);

    return currency;
};

const update = (id, data) => {
    const currency = getById(id);

    if (!currency) {
        return null;
    }

    currency.name = data.name ?? currency.name;
    currency.ticker = data.ticker ?? currency.ticker;

    return currency;
};

const remove = (id) => {
    const index = currencies.findIndex(
        c => c.id === Number(id)
    );

    if (index === -1) {
        return false;
    }

    currencies.splice(index, 1);

    return true;
};

const clear = () => {
    currencies = [];
    currentId = 1;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove,
    clear
};