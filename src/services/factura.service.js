const soap = require("soap");
const config = require("../config/siatConfig");

async function recepcionFactura(params) {
  const client = await soap.createClientAsync(config.wsdlRecepcionFactura);
  client.addHttpHeader("apikey", config.apiKey);

  return new Promise((resolve, reject) => {
    client.recepcionFactura(params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

module.exports = { recepcionFactura };
