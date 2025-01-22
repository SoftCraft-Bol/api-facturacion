const soap = require("soap");
const {
  wsdlFacturacionSincronizacion,
  apiKey,
  codigoAmbiente,
  codigoPuntoVenta,
  codigoSistema,
  codigoSucursal,
  nit,
} = require("../config/siatConfig");

const createSoapClient = async (wsdl) => {
  const client = await soap.createClientAsync(wsdl);
  client.addHttpHeader("apikey", apiKey);
  return client;
};

const sincronizarListaLeyendasFactura = async (cuis) => {
  const params = {
    SolicitudSincronizacion: {
      codigoAmbiente,
      codigoPuntoVenta,
      codigoSistema,
      codigoSucursal,
      cuis,
      nit,
    },
  };

  const client = await createSoapClient(wsdlFacturacionSincronizacion);
  return new Promise((resolve, reject) => {
    client.sincronizarListaLeyendasFactura(params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

const sincronizarActividades = async (cuis) => {
  const params = {
    SolicitudSincronizacion: {
      codigoAmbiente,
      codigoPuntoVenta: 1, // Diferente en este caso
      codigoSistema,
      codigoSucursal,
      cuis,
      nit,
    },
  };

  const client = await createSoapClient(wsdlFacturacionSincronizacion);
  return new Promise((resolve, reject) => {
    client.sincronizarActividades(params, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};

module.exports = { sincronizarListaLeyendasFactura, sincronizarActividades };
