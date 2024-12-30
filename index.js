const express = require('express');
const bodyParser = require('body-parser');
const facturacionRoutes = require('./routes/facturacion');

const app = express();

app.use(bodyParser.json());
app.use('/api/facturacion', facturacionRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
