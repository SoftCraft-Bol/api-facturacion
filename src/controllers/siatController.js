const SiatService = require("../services/siatService");

const express = require("express");
const soap = require("soap");
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");
const crypto = require("crypto");
const { create } = require("xmlbuilder2");
const { transform } = require("pdfkit");

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

  static async cuis(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos?wsdl";
    const codigoAmbiente = 2;
    const codigoModalidad = 1;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);
      client.addHttpHeader("apikey", apiKey);

      const result = await new Promise((resolve, reject) => {
        client.cuis(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "TOKEN NO VÁLIDO",
        error: error.message,
      });
    }
  }

  static async cufd(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos?wsdl";
    const codigoAmbiente = 2;
    const codigoModalidad = 1;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

    if (!cuis) {
      return res.status(400).json({
        success: false,
        message: "El parámetro 'cuis' es obligatorio.",
      });
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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);

      const result = await new Promise((resolve, reject) => {
        client.cufd(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      // Retornar respuesta al cliente
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
    }
  }

  static async sincronizarListaProductosServicios(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 1;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);
      const result = await new Promise((resolve, reject) => {
        client.sincronizarListaProductosServicios(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
    }
  }

  static async sincronizarListaLeyendasFactura(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);
      const result = await new Promise((resolve, reject) => {
        client.sincronizarListaLeyendasFactura(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
    }
  }

  static async sincronizarActividades(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);
      const result = await new Promise((resolve, reject) => {
        client.sincronizarActividades(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
    }
  }

  static async sincronizarFechaHora(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);
      const result = await new Promise((resolve, reject) => {
        client.sincronizarFechaHora(params, (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        });
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
    }
  }

  static async sincronizarParametricaTipoDocumentoSector(req, res) {
    const wsdl =
      "https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionSincronizacion?wsdl";
    const codigoAmbiente = 2;
    const codigoPuntoVenta = 0;
    const codigoSistema = "814D65E61B6176FAB65842E";
    const codigoSucursal = 0;
    const nit = "3655579015";

    const cuis = req.body.cuis;

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

    const apiKey =
      "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

    try {
      const client = await soap.createClientAsync(wsdl);

      client.addHttpHeader("apikey", apiKey);
      const result = await new Promise((resolve, reject) => {
        client.sincronizarParametricaTipoDocumentoSector(
          params,
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
      });

      res.status(200).json({ success: true, data: result });
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({
        success: false,
        message: "Error en la solicitud SOAP",
        error: error.message,
      });
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
      var tzoffset = new Date().getTimezoneOffset() * 60000;
      datos[0].cabecera.fechaEmision = new Date(Date.now() - tzoffset)
        .toISOString()
        .slice(0, -1);
      const valores = datos[0].cabecera;
      const nitEmisor = valores.nitEmisor.toString().padStart(13, "0");
      let fechaEmision = valores.fechaEmision.replace(/[-T:.]/g, "");
      const sucursal = "0".padStart(4, "0");
      const modalidad = 1;
      const tipoEmision = 1;
      const tipoFactura = 1;
      const tipoDocSector = "1".padStart(2, "0");
      const numeroFactura = valores.numeroFactura.toString().padStart(10, "0");
      const puntoVenta = "0".padStart(4, "0");
      //const codigoControl = req.session.scodigoControl; // Asume que estás usando un middleware de sesión
      const codigoControl = "0EE8198E7D51F74"; // Asume que estás usando un middleware de sesión
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
        .ele("facturaElectronicaCompraVenta")
        .att(
          xsi,
          "xsi:noNamespaceSchemaLocation",
          "facturaElectronicaCompraVenta.xsd"
        );

      formatoXml(temporal, xml);

      let xmlOutput = xml.end({ prettyPrint: true });
      xmlOutput = await agregarFirmaDigital(xml);

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

      //Para insertar en la base de datos
      // const data = insertarFactura(
      //   req.body,
      //   idCliente,
      //   numeroFactura,
      //   cuf,
      //   valores.fechaEmision,
      //   valores.codigoMetodoPago,
      //   valores.montoTotal,
      //   valores.montoTotalSujetoIva,
      //   valores.descuentoAdicional,
      //   fs.readFileSync(xmlPath, "utf8")
      // );

      console.log(hashArchivo);
      console.log(valores.fechaEmision);

      const resFactura = recepcionFactura(
        gzdata,
        valores.fechaEmision,
        hashArchivo
      );

      res.status(200).json(resFactura);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al emitir la factura" });
    }
  }
}

function formatoXml(temporal, xmlTemporal) {
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

async function agregarFirmaDigital(doc) {
  const xsi = "http://www.w3.org/2001/XMLSchema-instance";
  const privateKey = fs.readFileSync(
    "certs/privateKeyPan/clave_ANTONIA_COA_CARDONA.pem",
    "utf8"
  );
  const publicKey = fs.readFileSync(
    "certs/privateKeyPan/certificado_ANTONIA_COA_CARDONA.pem",
    "utf8"
  );

  // Canonicalizar el XML (sin espacios innecesarios, atributos ordenados, etc.)
  const canonicalXml = doc.end({ prettyPrint: false });

  // Generar HASH usando SHA256
  const hash = crypto.createHash("sha256").update(canonicalXml).digest();

  // Convertir el HASH a Base64
  const digestValue = hash.toString("base64");

  // Agregar las etiquetas de DigestValue
  const signatureNode = {
    Signature: {
      "@xmlns": "http://www.w3.org/2000/09/xmldsig#",
      SignedInfo: {
        CanonicalizationMethod: {
          "@Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        },
        SignatureMethod: {
          "@Algorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        },
        Reference: {
          "@URI": "",
          Transforms: {
            Transform: {
              "@Algorithm":
                "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            },
          },
          DigestMethod: {
            "@Algorithm": "http://www.w3.org/2001/04/xmlenc#sha256",
          },
          DigestValue: digestValue,
        },
      },
    },
  };

  const signedInfoXml = create(signatureNode).end({
    prettyPrint: false,
  });

  const signedInfoHash = crypto
    .createHash("sha256")
    .update(signedInfoXml)
    .digest();

  // Encriptar el HASH usando la llave privada (firma digital)
  const signatureValue = crypto
    .privateEncrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      signedInfoHash
    )
    .toString("base64");

  // Agregar SignatureValue y X509Certificate
  signatureNode.Signature.SignatureValue = signatureValue;
  signatureNode.Signature.KeyInfo = {
    X509Data: {
      X509Certificate: publicKey
        .replace(/-----\w+-----/g, "")
        .replace(/\n/g, ""),
    },
  };

  const signedXml = doc.ele(signatureNode).end({ prettyPrint: true });

  doc = create(signedXml);

  const parentNode = doc
    .find((n) => n.node.nodeName === "facturaElectronicaCompraVenta")
    .find((n) => n.node.nodeName === "Signature")
    .find((n) => n.node.nodeName === "SignedInfo")
    .find((n) => n.node.nodeName === "Reference")
    .find((n) => n.node.nodeName === "Transforms");

  if (parentNode) {
    parentNode.ele({
      Transform: {
        "@Algorithm":
          "http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments",
      },
    });
  }

  return doc.end({ prettyPrint: true });
}

async function recepcionFactura(archivo, fechaEnvio, hashArchivo) {
  const wsdl =
    "https://pilotosiatservicios.impuestos.gob.bo/v2/ServicioFacturacionCompraVenta?wsdl";

  const codigoAmbiente = 2;
  const codigoDocumentoSector = 1;
  const codigoEmision = 1;
  const codigoModalidad = 1;
  const codigoPuntoVenta = 0;
  const codigoSistema = "814D65E61B6176FAB65842E";
  const codigoSucursal = 0;
  const nit = "3655579015";
  const tipoFacturaDocumento = 1;

  // Simula la sesión de PHP
  // const cufd = session?.scufd || "defaultCufd";
  const cufd = "BQXlCKzQlREE=ODzZGQUI2NTg0MkU=QkFQWGtVSUJaVUFE0RDY1RTYxQjYxN";
  // const cuis = session?.scuis || "defaultCuis";
  const cuis = "41A4F2FF";

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

  const apiKey =
    "TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbnRvbmlhLmNvYUBob3RtYWlsLmNvbSIsImNvZGlnb1Npc3RlbWEiOiI4MTRENjVFNjFCNjE3NkZBQjY1ODQyRSIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTJNelUxTmJjME1EUUZBRnRjQTNRS0FBQUEiLCJpZCI6NTIwNjE3OSwiZXhwIjoxNzY3Nzc4NTA2LCJpYXQiOjE3MzYyNTY4NzYsIm5pdERlbGVnYWRvIjozNjU1NTc5MDE1LCJzdWJzaXN0ZW1hIjoiU0ZFIn0.5gshN0R3ZkcvrT6TeI8U5dRou_2VvS4J32Ghg8wERvThv62WZzkG5-OJZaC3vI7clLdPgvg5ffSrM-g7JJ3bag";

  try {
    const client = await soap.createClientAsync(wsdl);

    client.addHttpHeader("apikey", apiKey);
    const result = await new Promise((resolve, reject) => {
      client.recepcionFactura(params, (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      });
    });
    return result;
  } catch (error) {
    console.error("Error:", error.message);
    return "TOKEN NO VÁLIDO";
  }
}

module.exports = SiatController;
