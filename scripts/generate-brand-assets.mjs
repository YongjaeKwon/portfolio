import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const resolvePath = (relativePath) => fileURLToPath(new URL(relativePath, root));

const publicDir = resolvePath("public/");
const brandDir = resolvePath("public/brand/");
const faviconSvg = await readFile(resolvePath("public/favicon.svg"));
const markSvg = await readFile(resolvePath("public/brand/yongjae-mark.svg"));

await mkdir(brandDir, { recursive: true });

const renderPng = (source, size) =>
  sharp(source, { density: 512 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

const favicon32 = await renderPng(faviconSvg, 32);
const appleTouchIcon = await renderPng(faviconSvg, 180);
const logo512 = await renderPng(markSvg, 512);

await Promise.all([
  writeFile(resolvePath("public/favicon-32x32.png"), favicon32),
  writeFile(resolvePath("public/apple-touch-icon.png"), appleTouchIcon),
  writeFile(resolvePath("public/brand/yongjae-mark-512.png"), logo512),
]);

const icoSizes = [16, 32, 48, 256];
const icoImages = await Promise.all(icoSizes.map((size) => renderPng(faviconSvg, size)));
const icoHeader = Buffer.alloc(6 + icoImages.length * 16);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoImages.length, 4);

let offset = icoHeader.length;
icoImages.forEach((image, index) => {
  const size = icoSizes[index];
  const entryOffset = 6 + index * 16;
  icoHeader.writeUInt8(size === 256 ? 0 : size, entryOffset);
  icoHeader.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
  icoHeader.writeUInt8(0, entryOffset + 2);
  icoHeader.writeUInt8(0, entryOffset + 3);
  icoHeader.writeUInt16LE(1, entryOffset + 4);
  icoHeader.writeUInt16LE(32, entryOffset + 6);
  icoHeader.writeUInt32LE(image.length, entryOffset + 8);
  icoHeader.writeUInt32LE(offset, entryOffset + 12);
  offset += image.length;
});
await writeFile(resolvePath("public/favicon.ico"), Buffer.concat([icoHeader, ...icoImages]));

const markDataUri = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;
const ogBadge = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="132" height="132">
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="9" stdDeviation="10" flood-color="#1B64DA" flood-opacity="0.14"/>
      </filter>
    </defs>
    <rect x="12" y="8" width="108" height="108" rx="31" fill="#FFFFFF" stroke="#D7E9FF" filter="url(#shadow)"/>
    <image href="${markDataUri}" x="31" y="27" width="70" height="70"/>
  </svg>
`);

await sharp(resolvePath("public/og-image-v2.png"))
  .composite([{ input: ogBadge, left: 55, top: 57 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
  .toFile(resolvePath("public/og-image-v3.png"));

console.log("Generated YK Flow brand assets in", publicDir);
