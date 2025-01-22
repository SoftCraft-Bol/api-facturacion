const soap = require("soap");
const config = require("../config/siatConfig");

async function generaCUF(valores) {
  const params = {
    factura_numero: valores.numeroFactura,
    nit_emisor: valores.nitEmisor,
    fechaEmision: valores.fechaEmision,
    codigoControl: "8EA52775AE51F74",
  };

  const client = await soap.createClientAsync(config.wsdlFacturacionCodigos);
  const [cufResponse] = await client.generaCufAsync(params);
  return cufResponse.dato["$value"];
}

async function enviarFactura(archivoGzip, fechaEnvio, hashArchivo) {
  const params = {
    SolicitudServicioRecepcionFactura: {
      ...config,
      archivo: archivoGzip.toString("base64"),
      fechaEnvio,
      hashArchivo,
    },
  };

  const client = await soap.createClientAsync(config.wsdlRecepcionFactura);
  client.addHttpHeader("apikey", config.apiKey);
  const [result] = await client.recepcionFacturaAsync(params);
  return result;
}

module.exports = { generaCUF, enviarFactura };
