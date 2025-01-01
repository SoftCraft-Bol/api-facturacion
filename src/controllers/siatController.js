const SiatService = require("../services/siatService");

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
      const {
        codigoAmbiente,
        codigoSistema,
        nit,
        codigoModalidad,
        codigoSucursal,
        nitParaVerificacion,
      } = req.body;
      if (
        !codigoAmbiente ||
        !codigoSistema ||
        !nit ||
        !codigoModalidad ||
        !codigoSucursal ||
        !nitParaVerificacion
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Todos los campos son obligatorios: codigoAmbiente, codigoSistema, nit, codigoModalidad, codigoSucursal, nitParaVerificacion.",
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

  static async sincronizarListaProductosServicios(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "7252133BBD41148CB715337";
    const codigoSucursal = 0;
    const cuis = req.body.cuis; // Supuesto: viene del cuerpo de la solicitud
    const nit = "5556875011";

    console.log("Hola mundo");

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

    const options = {
      wsdl_headers: {
        apikey:
          "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI3MjUyMTMzQkJENDExNDhDQjcxNTMzNyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3MTI1OTgyLCJpYXQiOjE3MzU2MDQzNTIsIm5pdERlbGVnYWRvIjo1NTU2ODc1MDExLCJzdWJzaXN0ZW1hIjoiU0ZFIn0.9vTqKQ6zvVQeLgMQDflNeZtLZyeVTraYx7KrH3N4tOhWqrA5ViHI3J6t7fI8TV_Q20kDwB5aCeJ5CazgZ5t23w",
      },
      timeout: 5000,
    };

    try {
      const client = await soap.createClientAsync(wsdl, options);
      const [result] = await client.sincronizarListaProductosServiciosAsync(
        params
      );
      res.json(result);
    } catch (error) {
      console.error("Error en la sincronización:", error.message);
      res.status(500).send("TOKEN NO VÁLIDO");
    }
  }

  static async sincronizarListaLeyendasFactura(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "77535546B712DD409D7A387";
    const codigoSucursal = 0;
    const cuis = req.body.cuis; // Suponemos que el 'cuis' viene en el cuerpo de la solicitud
    const nit = "5153610012";

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

    const options = {
      wsdl_headers: {
        apikey:
          "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHdWljaGkxLiIsImNvZGlnb1Npc3RlbWEiOiI3NzUzNTU0NkI3MTJERDQwOUQ3QTM4NyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTFORFUyTXpRd01EUUNBTWdwRkpRS0FBQUEiLCJpZCI6MzAxNTc4OCwiZXhwIjoxNzAzOTgwODAwLCJpYXQiOjE2OTE2MDMxMzIsIm5pdERlbGVnYWRvIjo1MTUzNjEwMDEyLCJzdWJzaXN0ZW1hIjoiU0ZFIn0.Y61q9_pZiOG49HYRQ5OfXRHvDCh1V8hoviWuA472DgV5f3CdV-MOxz9y4u07AVB-bMByebK_wskxUWXf6cliQQ",
      },
      timeout: 5000,
    };

    try {
      const client = await soap.createClientAsync(wsdl, options);
      const [result] = await client.sincronizarListaLeyendasFacturaAsync(
        params
      );
      console.log(result);
      res.json(result);
    } catch (error) {
      console.error("Error en la sincronización:", error.message);
      res.status(500).send("TOKEN NO VÁLIDO");
    }
  }

  static async sincronizarParametricaUnidadMedida(req, res) {
    const wsdl = "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "77535546B712DD409D7A387";
    const codigoSucursal = 0;
    const cuis = req.body.cuis; // Supuesto: `cuis` viene en el cuerpo de la solicitud
    const nit = "5153610012";

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

    const options = {
      wsdl_headers: {
        apikey:
          "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHdWljaGkxLiIsImNvZGlnb1Npc3RlbWEiOiI3NzUzNTU0NkI3MTJERDQwOUQ3QTM4NyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTFORFUyTXpRd01EUUNBTWdwRkpRS0FBQUEiLCJpZCI6MzAxNTc4OCwiZXhwIjoxNzAzOTgwODAwLCJpYXQiOjE2OTE2MDMxMzIsIm5pdERlbGVnYWRvIjo1MTUzNjEwMDEyLCJzdWJzaXN0ZW1hIjoiU0ZFIn0.Y61q9_pZiOG49HYRQ5OfXRHvDCh1V8hoviWuA472DgV5f3CdV-MOxz9y4u07AVB-bMByebK_wskxUWXf6cliQQ",
      },
      timeout: 5000,
    };

    try {
      const client = await soap.createClientAsync(wsdl, options);
      const [result] = await client.sincronizarParametricaUnidadMedidaAsync(params);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error en la sincronización:", error.message);
      res.status(500).json({ success: false, message: "TOKEN NO VÁLIDO" });
    }
  }
}

module.exports = SiatController;
