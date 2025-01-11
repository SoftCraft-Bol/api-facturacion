const express = require("express");
const SiatController = require("../controllers/siatController");

const router = express.Router();

router.get("/verificar-comunicacion", SiatController.verificarComunicacion);
router.get("/verificar-nit", SiatController.verificarNit);
router.post(
  "/sincronizar-lista-productos",
  SiatController.sincronizarListaProductosServicios
);

router.post(
  "/sincronizar-lista-leyendas",
  SiatController.sincronizarListaLeyendasFactura
);
router.post("/sincronizar-actividades", SiatController.sincronizarActividades);
router.post(
  "/sincronizar-listaActividadesDocumentoSector",
  SiatController.sincronizarListaActividadesDocumentoSector
);
router.post(
  "/sincronizar-listaMensajesServicios",
  SiatController.sincronizarListaMensajesServicios
);
router.post("/sincronizar-fechaHora", SiatController.sincronizarFechaHora);
router.post(
  "/sincronizar-parametricaTipoDocumentoSector",
  SiatController.sincronizarParametricaTipoDocumentoSector
);
router.post(
  "/sincronizar-parametricaEventosSignificativos",
  SiatController.sincronizarParametricaEventosSignificativos
);
router.post(
  "/sincronizar-parametricaMotivoAnulacion",
  SiatController.sincronizarParametricaMotivoAnulacion
);
router.post(
  "/sincronizar-parametricaPaisOrigen",
  SiatController.sincronizarParametricaPaisOrigen
);
router.post(
  "/sincronizar-parametricaTipoEmision",
  SiatController.sincronizarParametricaTipoEmision
);
router.post(
  "/sincronizar-parametricaTipoHabitacion",
  SiatController.sincronizarParametricaTipoHabitacion
);
router.post(
  "/sincronizar-parametricaTipoMetodoPago",
  SiatController.sincronizarParametricaTipoMetodoPago
);
router.post(
  "/sincronizar-parametricaTipoMoneda",
  SiatController.sincronizarParametricaTipoMoneda
);
router.post(
  "/sincronizar-parametricaTipoPuntoVenta",
  SiatController.sincronizarParametricaTipoPuntoVenta
);
router.post(
  "/sincronizar-parametricaTiposFactura",
  SiatController.sincronizarParametricaTiposFactura
);

router.post(
  "/sincronizar-parametricaUnidadMedida",
  SiatController.sincronizarParametricaUnidadMedida
);
router.post(
  "/sincronizar-parametricaTipoDocumentoIdentidad",
  SiatController.sincronizarParametricaTipoDocumentoIdentidad
);

router.post("/emitirFactura", SiatController.emitirFactura);
router.get("/cuis", SiatController.cuis);
router.post("/cufd", SiatController.cufd);
router.get("/peticiones", SiatController.realizarPeticiones);

module.exports = router;
