#!/usr/bin/env node
/**
 * Vérifie que les icônes raster de public/ sont de VRAIS binaires (PNG/ICO),
 * et NON du SVG renommé.
 *
 * ⚠️ Historique : l'ancienne version de ce script copiait bêtement favicon.svg
 *    en favicon.ico et apple-touch-icon.png → fichiers SVG déguisés (741 o),
 *    l'icône iOS/Safari ne s'affichait pas. Ne JAMAIS refaire ça.
 *
 * Les vrais fichiers sont committés dans public/. Pour les RÉGÉNÉRER (macOS) :
 *
 *   # apple-touch-icon.png (180×180, carré orange plein)
 *   qlmanage -t -s 180 -o /tmp icon-apple.svg && mv /tmp/icon-apple.svg.png public/apple-touch-icon.png
 *   # favicon.ico = assemblage de PNG 16/32/48 (carré arrondi) en ICO multi-tailles
 *   for s in 16 32 48; do qlmanage -t -s $s -o /tmp favicon.svg && mv /tmp/favicon.svg.png /tmp/f$s.png; done
 *   # puis assembler /tmp/f{16,32,48}.png en ICO (PNG-in-ICO)
 *
 * Source de la marque : public/logo.svg / public/favicon.svg (orbitale orange #F97316).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public');

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47]); // \x89PNG
const ICO_SIG = Buffer.from([0x00, 0x00, 0x01, 0x00]); // ICONDIR (reserved, type=icon)

const checks = [
  { file: 'apple-touch-icon.png', sig: PNG_SIG, label: 'PNG' },
  { file: 'favicon.ico', sig: ICO_SIG, label: 'ICO' },
];

let failed = false;
for (const { file, sig, label } of checks) {
  const p = path.join(publicDir, file);
  const head = fs.readFileSync(p).subarray(0, 4);
  const ok = head.equals(sig);
  if (!ok) {
    failed = true;
    console.error(`❌ ${file} n'est PAS un vrai ${label} (entête: ${head.toString('hex')}). ` +
      `Probablement du SVG renommé — régénérer (voir entête de ce script).`);
  } else {
    console.log(`✓ ${file} est un vrai ${label}`);
  }
}

if (failed) process.exit(1);
console.log('\n✅ Icônes raster valides.');
