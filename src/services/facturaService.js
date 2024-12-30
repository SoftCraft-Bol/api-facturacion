const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const emitirFactura = async (facturaData) => {
    try {
        // Genera una nueva factura
        const factura = await prisma.factura.create({
            data: {
                numeroFactura: facturaData.numeroFactura,
                clienteNombre: facturaData.cliente.nombre,
                clienteNitCi: facturaData.cliente.nitCi,
                montoTotal: facturaData.montoTotal,
                estado: "PENDIENTE",
            },
        });

        // Simula la validación en SIAT
        const codigoControl = `COD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const facturaActualizada = await prisma.factura.update({
            where: { id: factura.id },
            data: { codigoControl, estado: "VALIDADA" },
        });

        return facturaActualizada;
    } catch (error) {
        console.error("Error al emitir la factura:", error);
        throw error;
    }
};

module.exports = { emitirFactura };
