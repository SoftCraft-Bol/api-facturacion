const express = require('express');
const bodyParser = require('body-parser');
const siatRoutes = require('./src/routes/siatRoutes');
const cufdRoutes = require('./src/routes/cufd.routes')
const syncRoutes = require("./src/routes/sync.routes");
const facturasRoutes = require("./src/routes/factura.routes");

require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use('/api/siat', siatRoutes);
app.use('/api/siat', cufdRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/factura", facturasRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
