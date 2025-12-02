#!/usr/bin/env node
/**
 * Fix lingering references to .component.scss/.component.css in styleUrls or import statements
 * after component renaming. Replaces occurrences of `.component.scss` -> `.scss` and
 * `.component.css` -> `.css` across all TS files under src/app.
 */
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/app');
let countFiles = 0, countReplacements = 0;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full);
    else if (full.endsWith('.ts')) await fixFile(full);
  }
}

async function fixFile(file) {
  let txt = await fs.readFile(file, 'utf8');
  const before = txt;
  txt = txt.replace(/\.component\.(scss|css)\b/g, (m, ext) => { countReplacements++; return `.${ext}`; });
  if (txt !== before) {
    await fs.writeFile(file, txt, 'utf8');
    countFiles++;
  }
}

(async () => {
  console.log('Scanning for lingering styleUrls references under', ROOT);
  await walk(ROOT);
  console.log(`Updated ${countFiles} files with ${countReplacements} replacements.`);
})();
