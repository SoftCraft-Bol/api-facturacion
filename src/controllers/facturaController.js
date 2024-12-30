const { generarYEnviarFactura } = require('../services/facturaService');

const emitir = async (req, res) => {
    try {
        const factura = await generarYEnviarFactura(req.body);
        res.status(201).json({ mensaje: 'Factura emitida correctamente', factura });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al emitir la factura', error: error.message });
    }
};

module.exports = { emitir };
