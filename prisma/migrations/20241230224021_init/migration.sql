-- CreateTable
CREATE TABLE `Factura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numeroFactura` VARCHAR(191) NOT NULL,
    `fechaEmision` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clienteNombre` VARCHAR(191) NOT NULL,
    `clienteNitCi` VARCHAR(191) NOT NULL,
    `montoTotal` DOUBLE NOT NULL,
    `codigoControl` VARCHAR(191) NULL,
    `estado` VARCHAR(191) NOT NULL DEFAULT 'PENDIENTE',

    UNIQUE INDEX `Factura_numeroFactura_key`(`numeroFactura`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
