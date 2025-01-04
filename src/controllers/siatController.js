const SiatService = require("../services/siatService");

const express = require("express");
const soap = require("soap");
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const crypto = require("crypto");
const { create } = require("xmlbuilder2");

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
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
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
      const [result] = await client.sincronizarParametricaUnidadMedidaAsync(
        params
      );
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error en la sincronización:", error.message);
      res.status(500).json({ success: false, message: "TOKEN NO VÁLIDO" });
    }
  }

  static async emitirFactura(req, res) {
    try {
      const datos = req.body.factura;
      const idCliente = req.body.id_cliente;

      console.log(datos);

      const valores = datos[0].cabecera;
      const nitEmisor = valores.nitEmisor.toString().padStart(13, "0");
      let fechaEmision = valores.fechaEmision.replace(/[-T:.]/g, "");
      const sucursal = "0".padStart(4, "0");
      const modalidad = 2;
      const tipoEmision = 1;
      const tipoFactura = 1;
      const tipoDocSector = "1".padStart(2, "0");
      const numeroFactura = valores.numeroFactura.toString().padStart(10, "0");
      const puntoVenta = "0".padStart(4, "0");
      //const codigoControl = req.session.scodigoControl; // Asume que estás usando un middleware de sesión
      const codigoControl = 123213; // Asume que estás usando un middleware de sesión
      const cadena = `${nitEmisor}${fechaEmision}${sucursal}${modalidad}${tipoEmision}${tipoFactura}${tipoDocSector}${numeroFactura}${puntoVenta}`;

      const wsdl = "https://indexingenieria.com/webservices/wssiatcuf.php?wsdl";
      const client = await soap.createClientAsync(wsdl);

      const params = {
        factura_numero: numeroFactura,
        nit_emisor: nitEmisor,
        fechaEmision: valores.fechaEmision,
        codigoControl: codigoControl,
      };
      const cuf = await client.generaCufAsync(params);

      datos[0].cabecera.cuf = cuf[0].dato["$value"];

      const xmlTemporal = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
      <facturaComputarizadaCompraVenta xsi:noNamespaceSchemaLocation="facturaComputarizadaCompraVenta.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></facturaComputarizadaCompraVenta>`;
      // formatoXml(temporal, xmlTemporal);

      const temporal = datos;
      const xsi = "http://www.w3.org/2001/XMLSchema-instance";
      const xml = create({
        version: "1.0",
        encoding: "UTF-8",
        standalone: true,
      })
        .ele("facturaComputarizadaCompraVenta")
        .att(
          xsi,
          "xsi:noNamespaceSchemaLocation",
          "facturaComputarizadaCompraVenta.xsd"
        );

      formatoXml(temporal, xml);

      // Generar el XML
      const xmlOutput = xml.end({ prettyPrint: true });

      console.log(xmlOutput);

      const xmlPath = path.join(__dirname, "docs", "facturaxml.xml");
      const zipPath = path.join(__dirname, "docs", "facturaxml.xml.zip");

      fs.writeFileSync(xmlPath, xmlOutput);

      const gzdata = zlib.gzipSync(fs.readFileSync(xmlPath), { level: 9 });
      fs.writeFileSync(zipPath, gzdata);

      const hashArchivo = crypto
        .createHash("sha256")
        .update(fs.readFileSync(xmlPath))
        .digest("hex");

      // const data = insertarFactura(
      //   req.body,
      //   idCliente,
      //   numeroFactura,
      //   cuf[0],
      //   valores.fechaEmision,
      //   valores.codigoMetodoPago,
      //   valores.montoTotal,
      //   valores.montoTotalSujetoIva,
      //   valores.descuentoAdicional,
      //   fs.readFileSync(xmlPath, "utf8")
      // );

      if (data) {
        const resFactura = this.recepcionFactura(
          gzdata,
          valores.fechaEmision,
          hashArchivo
        );

        res.status(200).json(resFactura);
      } else {
        res.status(500).json({ error: "Error al insertar la factura" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al emitir la factura" });
    }
  }

  static async recepcionFactura(archivo, fechaEnvio, hashArchivo, session) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl";
    const codigoAmbiente = 2;
    const codigoDocumentoSector = 1;
    const codigoEmision = 1;
    const codigoModalidad = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "77535546B712DD409D7A387";
    const codigoSucursal = 0;
    const nit = "5153610012";
    const tipoFacturaDocumento = 1;

    // Simula la sesión de PHP
    const cufd = session?.scufd || "defaultCufd";
    const cuis = session?.scuis || "defaultCuis";

    const params = {
      SolicitudServicioRecepcionFactura: {
        codigoAmbiente,
        codigoDocumentoSector,
        codigoEmision,
        codigoModalidad,
        codigoPuntoVenta,
        codigoSistema,
        codigoSucursal,
        cufd,
        cuis,
        nit,
        tipoFacturaDocumento,
        archivo,
        fechaEnvio,
        hashArchivo,
      },
    };

    const headers = {
      apikey:
        "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHdWljaGkxLiIsImNvZGlnb1Npc3RlbWEiOiI3NzUzNTU0NkI3MTJERDQwOUQ3QTM4NyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTFORFUyTXpRd01EUUNBTWdwRkpRS0FBQUEiLCJpZCI6MzAxNTc4OCwiZXhwIjoxNzAzOTgwODAwLCJpYXQiOjE2OTE2MDMxMzIsIm5pdERlbGVnYWRvIjo1MTUzNjEwMDEyLCJzdWJzaXN0ZW1hIjoiU0ZFIn0.Y61q9_pZiOG49HYRQ5OfXRHvDCh1V8hoviWuA472DgV5f3CdV-MOxz9y4u07AVB-bMByebK_wskxUWXf6cliQQ",
    };

    try {
      const response = await axios.post(wsdl, params, { headers });
      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
      return "TOKEN NO VÁLIDO";
    }
  }
}

function formatoXml(temporal, xmlTemporal) {
  const nsXsi = "http://www.w3.org/2001/XMLSchema-instance";
  temporal.forEach((item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (typeof value === "object" && !Array.isArray(value) && value != null)
        value = [value];
      if (Array.isArray(value)) {
        const subnode = xmlTemporal.ele(key);
        formatoXml(value, subnode);
      } else {
        if (value === null || value === undefined) {
          const hijo = xmlTemporal.ele(key);
          hijo.att("xsi:nil", "true");
        } else {
          xmlTemporal.ele({ [key]: value });
        }
      }
    });
  });
}

// function formatoXml(temporal, xmlTemporal) {
//   const nsXsi = "http://www.w3.org/2001/XMLSchema-instance";
//   temporal.forEach((item) => {
//     Object.entries(item).forEach(([key, value]) => {
//       if (Array.isArray(value)) {
//         value.forEach((subItem) => {
//           formatoXml([subItem], xmlTemporal.ele(key));
//         });
//       } else if (value === null || value === undefined) {
//         const subNode = xmlTemporal.ele(key, "");
//         subNode.att("xsi:nil", "true", nsXsi);
//       } else {
//         xmlTemporal.ele(key).ele(value);
//       }
//     });
//   });
// }

module.exports = SiatController;
