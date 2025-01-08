const express = require("express");
const SiatController = require("../controllers/siatController");

const router = express.Router();

router.get("/verificar-comunicacion", SiatController.verificarComunicacion);
router.get("/verificar-nit", SiatController.verificarNit);
router.post(
  "/sincroniza-lista-productos",
  SiatController.sincronizarListaProductosServicios
);

router.post(
  "/sincronizar-lista-leyendas",
  SiatController.sincronizarListaLeyendasFactura
);
router.post("/sincronizar-actividades", SiatController.sincronizarActividades);
router.post("/sincronizar-fechaHora", SiatController.sincronizarFechaHora);
router.post(
  "/sincronizar-parametricaTipoDocumentoSector",
  SiatController.sincronizarParametricaTipoDocumentoSector
);
router.get(
  "/sincronizar-unidad-medida",
  SiatController.sincronizarParametricaUnidadMedida
);
router.post("/emitirFactura", SiatController.emitirFactura);
router.get("/cuis", SiatController.cuis);
router.post("/cufd", SiatController.cufd);

module.exports = router;
