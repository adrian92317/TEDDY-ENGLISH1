// Dibuja los íconos de la PWA (PNG) a partir de un SVG de Teddy hecho en código.
// Uso: npm run iconos   (necesita Playwright con Chromium)
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const cara = `
  <circle cx="150" cy="170" r="70" fill="#C98A4B"/><circle cx="362" cy="170" r="70" fill="#C98A4B"/>
  <circle cx="150" cy="170" r="36" fill="#F1D3A8"/><circle cx="362" cy="170" r="36" fill="#F1D3A8"/>
  <circle cx="256" cy="280" r="170" fill="#C98A4B"/>
  <ellipse cx="256" cy="334" rx="78" ry="60" fill="#F1D3A8"/>
  <ellipse cx="256" cy="306" rx="28" ry="20" fill="#4A2F1B"/>
  <path d="M218 346 Q256 380 294 346" fill="none" stroke="#4A2F1B" stroke-width="11" stroke-linecap="round"/>
  <circle cx="190" cy="252" r="22" fill="#4A2F1B"/><circle cx="322" cy="252" r="22" fill="#4A2F1B"/>
  <circle cx="198" cy="244" r="7" fill="#fff"/><circle cx="330" cy="244" r="7" fill="#fff"/>
  <circle cx="140" cy="322" r="22" fill="#F29C8A" opacity="0.6"/><circle cx="372" cy="322" r="22" fill="#F29C8A" opacity="0.6"/>
  <path d="M120 420 Q256 492 392 420 L398 462 Q256 534 114 462 Z" fill="#E5484D"/>`;

const svg = (fondo, escala) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  ${fondo}<g transform="translate(256 256) scale(${escala}) translate(-256 -300)">${cara}</g></svg>`;

const redondo = `<rect width="512" height="512" rx="112" fill="#FFB84D"/>`;
const lleno = `<rect width="512" height="512" fill="#FFB84D"/>`;

const salidas = [
  ["public/icons/icon-192.png", 192, svg(redondo, 0.92)],
  ["public/icons/icon-512.png", 512, svg(redondo, 0.92)],
  ["public/icons/icon-maskable-512.png", 512, svg(lleno, 0.68)],
];

const navegador = await chromium.launch();
for (const [ruta, lado, contenido] of salidas) {
  const pagina = await navegador.newPage({ viewport: { width: lado, height: lado } });
  await pagina.setContent(`<body style="margin:0">${contenido.replace("<svg", `<svg width="${lado}" height="${lado}"`)}</body>`);
  writeFileSync(ruta, await pagina.screenshot({ omitBackground: true }));
  await pagina.close();
}
await navegador.close();
writeFileSync("public/favicon.svg", svg(redondo, 0.92));
console.log("Íconos listos en public/icons/");
