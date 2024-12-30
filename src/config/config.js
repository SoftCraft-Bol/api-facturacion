require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    siat: {
        url: process.env.SIAT_URL || "https://pilotosiat.impuestos.gob.bo/v2",
        token: process.env.SIAT_TOKEN || "",
        nit: process.env.NIT || "",
        codigoSistema: process.env.CODIGO_SISTEMA || "",
    },
    databaseUrl: process.env.DATABASE_URL || "mongodb://localhost:27017/facturacion",
};

module.exports = config;
