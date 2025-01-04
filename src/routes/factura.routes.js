const express = require("express");
const { emitir } = require("../controllers/facturaController");
const SiatController = require("../controllers/siatController");

const router = express.Router();

router.post("/emitir", emitir);

module.exports = router;
