const SiatService = require('../services/siatService');

class SiatController {
  static async verificarComunicacion(req, res) {
    try {
      const result = await SiatService.verificarComunicacion();
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async verificarNit(req, res) {
    try {
      const { codigoAmbiente, codigoSistema, nit, codigoModalidad, codigoSucursal, nitParaVerificacion } = req.body;
      if (!codigoAmbiente || !codigoSistema || !nit || !codigoModalidad || !codigoSucursal || !nitParaVerificacion) {
        return res.status(400).json({
          success: false,
          message: 'Todos los campos son obligatorios: codigoAmbiente, codigoSistema, nit, codigoModalidad, codigoSucursal, nitParaVerificacion.',
        });
      }
      const result = await SiatService.verificarNit({
        codigoAmbiente,
        codigoSistema,
        nit,
        codigoModalidad,
        codigoSucursal,
        nitParaVerificacion,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = SiatController;