const generarCUF = (datos) => {
    // Valores necesarios para generar el CUF
    const nitEmisor = datos.nitEmisor; // NIT del emisor
    const fechaEmision = datos.fechaEmision.replace(/[-T:.]/g, ''); // YYYYMMDDHHMMSS
    const sucursal = datos.codigoSucursal.toString().padStart(4, '0');
    const modalidad = datos.codigoModalidad.toString();
    const tipoEmision = datos.tipoEmision.toString();
    const tipoFactura = datos.tipoFacturaDocumento.toString();
    const tipoDocSector = datos.codigoDocumentoSector.toString();
    const nroFactura = datos.numeroFactura.toString().padStart(10, '0');
    const puntoVenta = datos.codigoPuntoVenta.toString().padStart(4, '0');

    // Concatenar los valores
    const concatenado = `${nitEmisor}${fechaEmision}${sucursal}${modalidad}${tipoEmision}${tipoFactura}${tipoDocSector}${nroFactura}${puntoVenta}`;

    // Agregar un dígito de verificación al final (CRC-11, por ejemplo)
    const modulo11 = (num) => {
        let suma = 0, factor = 2;
        for (let i = num.length - 1; i >= 0; i--) {
            suma += parseInt(num[i]) * factor;
            factor = factor === 7 ? 2 : factor + 1;
        }
        const resto = suma % 11;
        return resto === 0 ? 0 : 11 - resto;
    };

    const digitoVerificador = modulo11(concatenado);
    return concatenado + digitoVerificador.toString();
};
