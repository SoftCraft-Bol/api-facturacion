const { createFacturaXml } = require("../utils/xml.utils");
const { agregarFirmaDigital } = require("../utils/signature.utils");
const { compressXml } = require("../utils/compression.utils");
const { recepcionFactura } = require("../services/factura.service");
const path = require("path");

class FacturaController {
  static async emitirFactura(req, res) {
    try {
      const datos = req.body.factura;
      datos[0].cabecera.fechaEmision = new Date().toISOString();
      const xmlOutput = createFacturaXml(datos);
      const signedXml = await agregarFirmaDigital(xmlOutput);

      const docPath = path.join(__dirname, "../docs");
      const { gzdata, hashArchivo } = compressXml(signedXml, docPath);

      const result = await recepcionFactura({
        archivo: gzdata.toString("base64"),
        fechaEnvio: datos[0].cabecera.fechaEmision,
        hashArchivo,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = FacturaController;
