const express = require("express");
const SiatController = require("../controllers/siatController");

const router = express.Router();

router.post("/emitir", SiatController.emitirFactura);

module.exports = router;
