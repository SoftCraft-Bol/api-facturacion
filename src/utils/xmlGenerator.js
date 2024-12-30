const xmlbuilder = require('xmlbuilder');

const generarXMLFactura = (factura) => {
    const xml = xmlbuilder.create('FacturaElectronica')
        .att('xmlns', 'https://siat.impuestos.gob.bo/schema')
        .ele('cabecera')
            .ele('nitEmisor', factura.nitEmisor).up()
            .ele('numeroFactura', factura.numeroFactura).up()
            .ele('fechaEmision', factura.fechaEmision).up()
            .ele('montoTotal', factura.montoTotal).up()
        .up()
        .ele('detalle')
            .ele('detalleProducto')
                .ele('codigoProducto', factura.producto.codigo).up()
                .ele('descripcion', factura.producto.descripcion).up()
                .ele('precioUnitario', factura.producto.precio).up()
            .up()
        .end({ pretty: true });

    return xml;
};

module.exports = { generarXMLFactura };
