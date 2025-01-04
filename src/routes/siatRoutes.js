const express = require("express");
const SiatController = require("../controllers/siatController");

const router = express.Router();

router.get("/verificar-comunicacion", SiatController.verificarComunicacion);
router.get("/verificar-nit", SiatController.verificarNit);
router.get("/sincronizar", SiatController.sincronizarListaProductosServicios);
router.get(
  "/sincronizar-leyendas",
  SiatController.sincronizarListaLeyendasFactura
);
router.get(
  "/sincronizar-unidad-medida",
  SiatController.sincronizarParametricaUnidadMedida
);
router.post("/emitirFactura", SiatController.emitirFactura);

module.exports = router;
