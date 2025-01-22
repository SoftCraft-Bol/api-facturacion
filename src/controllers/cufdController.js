const { wsdlFacturacionCodigos, wsdlFacturacionSincronizacion, codigoAmbiente, codigoModalidad, codigoPuntoVenta, codigoSistema, codigoSucursal, nit } = require("../config/siatConfig");
const { makeSoapRequest } = require("../services/cufdService");

async function getCuis(req, res) {
  const params = {
    SolicitudCuis: {
      codigoAmbiente,
      codigoModalidad,
      codigoPuntoVenta,
      codigoSistema,
      codigoSucursal,
      nit,
    },
  };

  try {
    const result = await makeSoapRequest(wsdlFacturacionCodigos, "cuis", params);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "TOKEN NO VÁLIDO", error: error.message });
  }
}

async function getCufd(req, res) {
  const { cuis } = req.body;

  if (!cuis) {
    return res.status(400).json({ success: false, message: "El parámetro 'cuis' es obligatorio." });
  }

  const params = {
    SolicitudCufd: {
      codigoAmbiente,
      codigoModalidad,
      codigoPuntoVenta,
      codigoSistema,
      codigoSucursal,
      cuis,
      nit,
    },
  };

  try {
    const result = await makeSoapRequest(wsdlFacturacionCodigos, "cufd", params);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en la solicitud SOAP", error: error.message });
  }
}

async function sincronizarListaProductosServicios(req, res) {
  const { cuis } = req.body;

  if (!cuis) {
    return res.status(400).json({ success: false, message: "El parámetro 'cuis' es obligatorio." });
  }

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

  try {
    const result = await makeSoapRequest(wsdlFacturacionSincronizacion, "sincronizarListaProductosServicios", params);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error en la solicitud SOAP", error: error.message });
  }
}

module.exports = { getCuis, getCufd, sincronizarListaProductosServicios };
