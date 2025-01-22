const { sincronizarListaLeyendasFactura, sincronizarActividades } = require("../services/sync.service");

const sincronizarListaLeyendas = async (req, res) => {
  const { cuis } = req.body;

  if (!cuis) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'cuis' es obligatorio.",
    });
  }

  try {
    const result = await sincronizarListaLeyendasFactura(cuis);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error en la sincronización de leyendas.",
      error: error.message,
    });
  }
};

const sincronizarActividadesHandler = async (req, res) => {
  const { cuis } = req.body;

  if (!cuis) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'cuis' es obligatorio.",
    });
  }

  try {
    const result = await sincronizarActividades(cuis);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Error en la sincronización de actividades.",
      error: error.message,
    });
  }
};

module.exports = { sincronizarListaLeyendas, sincronizarActividadesHandler };
