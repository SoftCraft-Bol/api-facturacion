const { generarXMLFactura } = require('../utils/xmlGenerator');
const { firmarXML } = require('../utils/signer');
const prisma = require('../config/database');
const axios = require('axios');

const generarYEnviarFactura = async (facturaData) => {
    try {
        // Generar XML
        const xmlFactura = generarXMLFactura(facturaData);

        // Firmar XML
        const xmlFirmado = firmarXML(xmlFactura, './certs/certificado.pfx', './certs/clave.pem');

        // Enviar al SIAT
        const response = await axios.post('https://pilotosiat.impuestos.gob.bo/v2/facturacion', xmlFirmado, {
            headers: {
                'Content-Type': 'application/xml',
                Authorization: `Bearer ${process.env.SIAT_TOKEN}`,
            },
        });

        // Guardar respuesta
        const factura = await prisma.factura.create({
            data: {
                numeroFactura: facturaData.numeroFactura,
                clienteNombre: facturaData.cliente.nombre,
                clienteNitCi: facturaData.cliente.nitCi,
                montoTotal: facturaData.montoTotal,
                estado: response.data.estado,
                codigoControl: response.data.codigoControl,
            },
        });

        return factura;
    } catch (error) {
        console.error('Error al procesar la factura:', error);
        throw error;
    }
};

module.exports = { generarYEnviarFactura };
