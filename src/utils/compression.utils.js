const fs = require("fs");
const zlib = require("zlib");
const crypto = require("crypto");
const path = require("path");

function compressXml(xmlOutput, docPath) {
  const xmlPath = path.join(docPath, "facturaxml.xml");
  const zipPath = path.join(docPath, "facturaxml.xml.zip");

  fs.writeFileSync(xmlPath, xmlOutput);
  const gzdata = zlib.gzipSync(fs.readFileSync(xmlPath), { level: 9 });
  fs.writeFileSync(zipPath, gzdata);

  const hashArchivo = crypto.createHash("sha256").update(fs.readFileSync(xmlPath)).digest("hex");
  return { gzdata, hashArchivo };
}

module.exports = { compressXml };
