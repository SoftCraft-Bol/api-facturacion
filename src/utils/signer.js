const fs = require('fs');
const forge = require('node-forge');

const firmarXML = (xml, certPath, keyPath) => {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const certificado = fs.readFileSync(certPath, 'utf8');

    const p7 = forge.pkcs7.createSignedData();
    p7.content = forge.util.createBuffer(xml, 'utf8');
    p7.addCertificate(certificado);
    p7.addSigner({
        key: privateKey,
        certificate: certificado,
        digestAlgorithm: forge.pki.oids.sha256,
        authenticatedAttributes: [
            { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
            { type: forge.pki.oids.messageDigest },
            { type: forge.pki.oids.signingTime, value: new Date() },
        ],
    });
    p7.sign();

    const signedData = forge.pkcs7.messageToPem(p7);
    return signedData;
};

module.exports = { firmarXML };
