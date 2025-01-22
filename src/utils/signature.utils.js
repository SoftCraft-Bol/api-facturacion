const fs = require("fs");
const crypto = require("crypto");
const { create } = require("xmlbuilder2");

async function agregarFirmaDigital(doc) {
  const privateKey = fs.readFileSync("certs/clave.pem", "utf8");
  const publicKey = fs.readFileSync("certs/certificado.pem", "utf8");

  const canonicalXml = doc.end({ prettyPrint: false });
  const hash = crypto.createHash("sha256").update(canonicalXml).digest();
  const digestValue = hash.toString("base64");

  const signatureNode = {
    Signature: {
      "@xmlns": "http://www.w3.org/2000/09/xmldsig#",
      SignedInfo: {
        CanonicalizationMethod: {
          "@Algorithm": "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
        },
        SignatureMethod: {
          "@Algorithm": "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
        },
        Reference: {
          "@URI": "",
          Transforms: {
            Transform: {
              "@Algorithm": "http://www.w3.org/2000/09/xmldsig#enveloped-signature",
            },
          },
          DigestMethod: {
            "@Algorithm": "http://www.w3.org/2001/04/xmlenc#sha256",
          },
          DigestValue: digestValue,
        },
      },
    },
  };

  const signedInfoXml = create(signatureNode).end({ prettyPrint: false });
  const signedInfoHash = crypto.createHash("sha256").update(signedInfoXml).digest();
  const signatureValue = crypto.privateEncrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
    signedInfoHash
  ).toString("base64");

  signatureNode.Signature.SignatureValue = signatureValue;
  signatureNode.Signature.KeyInfo = {
    X509Data: {
      X509Certificate: publicKey.replace(/-----\w+-----/g, "").replace(/\n/g, ""),
    },
  };

  return create(signatureNode).end({ prettyPrint: true });
}

module.exports = { agregarFirmaDigital };
