const express = require('express');
const SiatController = require('../controllers/siatController');

const router = express.Router();

router.get('/verificar-comunicacion', SiatController.verificarComunicacion);
router.get('/verificar-nit', SiatController.verificarNit);

module.exports = router;