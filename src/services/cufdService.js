const soap = require("soap");
const { apiKey } = require("../config/siatConfig");

async function makeSoapRequest(wsdl, method, params) {
  try {
    const client = await soap.createClientAsync(wsdl);
    client.addHttpHeader("apikey", apiKey);

    return await new Promise((resolve, reject) => {
      client[method](params, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  } catch (error) {
    throw new Error(`Error en SOAP: ${error.message}`);
  }
}

module.exports = { makeSoapRequest };
