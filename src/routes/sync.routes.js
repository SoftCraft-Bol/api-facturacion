const express = require("express");
const { sincronizarListaLeyendas, sincronizarActividadesHandler } = require("../controllers/sync.controller");

const router = express.Router();

router.post("/sincronizar-list-leyendas", sincronizarListaLeyendas);
router.post("/sincronizar-actividades", sincronizarActividadesHandler);

module.exports = router;
