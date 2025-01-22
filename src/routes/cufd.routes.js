const express = require("express");
const { getCuis, getCufd, sincronizarListaProductosServicios } = require("../controllers/cufdController");

const router = express.Router();

router.post("/cuis", getCuis);
router.post("/cufd", getCufd);
router.post("/sincronizar-lista", sincronizarListaProductosServicios);

module.exports = router;
