const { create } = require("xmlbuilder2");

function formatoXml(data, xmlTemporal) {
  data.forEach((item) => {
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

function createFacturaXml(data) {
  const xsi = "http://www.w3.org/2001/XMLSchema-instance";
  const xml = create({ version: "1.0", encoding: "UTF-8", standalone: true })
    .ele("facturaElectronicaCompraVenta")
    .att(xsi, "xsi:noNamespaceSchemaLocation", "facturaElectronicaCompraVenta.xsd");

  formatoXml(data, xml);

  return xml.end({ prettyPrint: true });
}

module.exports = { formatoXml, createFacturaXml };
