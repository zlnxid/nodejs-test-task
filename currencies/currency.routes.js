const express = require("express");
const controller = require("./currency.controller");
const router = express.Router();

router.get("/", controller.getAllCurrencies);

router.get("/:id", controller.getCurrencyById);

router.post("/", controller.createCurrency);

router.put("/:id", controller.updateCurrency);

router.delete("/:id", controller.deleteCurrency);

module.exports = router;