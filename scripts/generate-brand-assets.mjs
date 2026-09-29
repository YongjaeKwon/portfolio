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

// 공유 이미지: 사이트와 같은 숫자 포스터 문법(종이 바탕 · 먹색 · 주홍 하나)
const markDataUri = `data:image/svg+xml;base64,${markSvg.toString("base64")}`;
const ogSvg = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#F6F5F1"/>
    <rect x="64" y="96" width="1072" height="4" fill="#111111"/>
    <image href="${markDataUri}" x="64" y="30" width="52" height="52"/>
    <text x="1136" y="66" text-anchor="end" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="24" font-weight="700" fill="#111111">yongjaekwon.com</text>
    <text x="58" y="288" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="168" font-weight="900" letter-spacing="-8" fill="#111111">권용재<tspan fill="#E5482B">.</tspan></text>
    <text x="66" y="356" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="34" font-weight="700" fill="#3D3D3D">필요한 기능을 만들고, 쓰이는 모습까지 확인하는 웹 개발자</text>
    <rect x="64" y="420" width="1072" height="2" fill="#111111"/>
    <text x="64" y="530" font-family="JetBrains Mono, Consolas, monospace" font-size="96" font-weight="800" letter-spacing="-5" fill="#111111">63~69<tspan font-size="40">ms</tspan></text>
    <text x="66" y="580" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="24" font-weight="700" fill="#5F5E59">60초 안에 끝나지 않던 조회</text>
    <rect x="560" y="444" width="1" height="150" fill="#CFCDC6"/>
    <text x="600" y="530" font-family="JetBrains Mono, Consolas, monospace" font-size="96" font-weight="800" letter-spacing="-5" fill="#111111">300<tspan fill="#E5482B">~</tspan>400</text>
    <text x="602" y="580" font-family="Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif" font-size="24" font-weight="700" fill="#5F5E59">건 압축을 추적 가능한 작업으로</text>
  </svg>
`);

await sharp(ogSvg, { density: 72 })
  .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 10 })
  .toFile(resolvePath("public/og-image-v4.png"));

console.log("Generated YK brand assets in", publicDir);
