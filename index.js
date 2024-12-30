const express = require('express');
const bodyParser = require('body-parser');
const facturaRoutes = require('./routes/factura.routes');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use('/api/facturas', facturaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
