const fs = require('fs');
const crypto = require('crypto');
const xmldom = require('@xmldom/xmldom');
const SignedXml = require('xml-crypto').SignedXml;
const xpath = require('xpath');

class FacturaFirmador {
    constructor() {
        this.TRANSFORM_ALGORITHMS = [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315#WithComments'
        ];

        this.DIGEST_ALGORITHM = 'http://www.w3.org/2001/04/xmlenc#sha256';
        this.SIGNATURE_ALGORITHM = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
        this.C14N_ALGORITHM = 'http://www.w3.org/2001/10/xml-exc-c14n#';
    }

    async firmarXML(xmlData) {
        try {
            // Leer certificado y clave privada
            const privateKey = fs.readFileSync("certs/clave.pem", "utf8");
            const certificate = fs.readFileSync("certs/certificado.pem", "utf8")
                .replace(/-----BEGIN CERTIFICATE-----/g, '')
                .replace(/-----END CERTIFICATE-----/g, '')
                .replace(/\n/g, '');

            // Crear documento XML
            const doc = new xmldom.DOMParser().parseFromString(xmlData, 'text/xml');

            // Crear firma
            const sig = new SignedXml();

            // Configurar la firma
            sig.signatureAlgorithm = this.SIGNATURE_ALGORITHM;
            sig.canonicalizationAlgorithm = this.C14N_ALGORITHM;
            sig.addReference(
                "//*[local-name(.)='facturaElectronicaCompraVenta']",
                [this.TRANSFORM_ALGORITHMS], // Lista de transformaciones
                this.DIGEST_ALGORITHM,        // Algoritmo de digestión
                ''                           // URI vacía si se firma todo el documento
            );
            

            // Configurar clave privada
            sig.signingKey = privateKey;

            // Agregar información del certificado
            sig.keyInfoProvider = {
                getKeyInfo: () => {
                    return `<X509Data><X509Certificate>${certificate}</X509Certificate></X509Data>`;
                }
            };

            // Computar la firma
            sig.computeSignature(xmlData, {
                prefix: 'ds',
                location: { reference: "//*[local-name(.)='facturaElectronicaCompraVenta']", action: "append" }
            });

            // Obtener XML firmado
            return sig.getSignedXml();

        } catch (error) {
            console.error('Error al firmar XML:', error);
            throw error;
        }
    }

    verifySignature(signedXml) {
        try {
            const doc = new xmldom.DOMParser().parseFromString(signedXml);
            const signatures = xpath.select("//*//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']", doc);
            
            if (signatures.length === 0) {
                throw new Error('No se encontró firma en el documento');
            }

            const signature = new SignedXml();
            signature.loadSignature(signatures[0]);
            const publicKey = fs.readFileSync("certs/certificado.pem", "utf8");
            
            return signature.checkSignature(publicKey);
        } catch (error) {
            console.error('Error al verificar firma:', error);
            throw error;
        }
    }
}

module.exports = new FacturaFirmador();
