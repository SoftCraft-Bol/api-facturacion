const axios = require('axios');
const xml2js = require('xml2js');

const siatEndpoint = 'https://pilotosiatservicios.impuestos.gob.bo/v2/FacturacionCodigos';

class SiatService {
  static async soapRequest(operation, params) {
    const soapBody = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:siat="https://siat.impuestos.gob.bo/">
        <soapenv:Header/>
        <soapenv:Body>
          <siat:${operation}>
            ${params}
          </siat:${operation}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const response = await axios.post(siatEndpoint, soapBody, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'apikey': 'TokenApi eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHdWljaGkxLiIsImNvZGlnb1Npc3RlbWEiOiI3NzUzNTU0NkI3MTJERDQwOUQ3QTM4NyIsIm5pdCI6Ikg0c0lBQUFBQUFBQUFETTFORFUyTXpRd01EUUNBTWdwRkpRS0FBQUEiLCJpZCI6MzAxNTc4OCwiZXhwIjoxNzAzOTgwODAwLCJpYXQiOjE2OTE2MDMxMzIsIm5pdERlbGVnYWRvIjo1MTUzNjEwMDEyLCJzdWJzaXN0ZW1hIjoiU0ZFIn0.Y61q9_pZiOG49HYRQ5OfXRHvDCh1V8hoviWuA472DgV5f3CdV-MOxz9y4u07AVB-bMByebK_wskxUWXf6cliQQ',
        },
      });

      const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });
      return result['soapenv:Envelope']['soapenv:Body'];
    } catch (error) {
      console.error('Error en la solicitud SOAP:', error.message);
      throw new Error('Error al comunicarse con el servicio SIAT.');
    }
  }

  static async verificarNit({ codigoAmbiente, codigoSistema, nit, codigoModalidad, codigoSucursal, nitParaVerificacion }) {
    const params = `
      <codigoAmbiente>${codigoAmbiente}</codigoAmbiente>
      <codigoSistema>${codigoSistema}</codigoSistema>
      <nit>${nit}</nit>
      <codigoModalidad>${codigoModalidad}</codigoModalidad>
      <codigoSucursal>${codigoSucursal}</codigoSucursal>
      <nitParaVerificacion>${nitParaVerificacion}</nitParaVerificacion>
    `;
    return this.soapRequest('verificarNit', params);
  }

  static async verificarComunicacion() {
    return this.soapRequest('verificarComunicacion', '');
  }
}

module.exports = SiatService;