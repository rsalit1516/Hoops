#!/usr/bin/env node
/**
 * Bulk rename Angular component files removing the .component part from filenames
 * and removing the Component suffix from class names & references.
 *
 * Run from hoops.ui/: `node scripts/rename-components.mjs`
 */
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/app');
const LOG_PATH = path.resolve(process.cwd(), 'scripts/rename-components-log.json');

async function listFiles(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await listFiles(full)); else out.push(full);
  }
  return out;
}

function isComponentTs(file) { return file.endsWith('.component.ts'); }
function pairedAsset(file, ext) { return file.replace(/\.component\.ts$/, `.component.${ext}`); }
async function pathExists(p) { try { await fs.access(p); return true; } catch { return false; } }
async function renameFile(oldPath, newPath) { await fs.mkdir(path.dirname(newPath), { recursive: true }); await fs.rename(oldPath, newPath); }

async function transformTs(file, classMap) {
  let txt = await fs.readFile(file, 'utf8');
  // Remove .component from import specifiers (static & dynamic)
  txt = txt.replace(/(from\s+['"].*?)\.component(['"])/g, '$1$2');
  txt = txt.replace(/(import\(\s*['"].*?)\.component(['"])\)/g, '$1$2)');
  // Template & styleUrl references
  txt = txt.replace(/templateUrl:\s*['"]([^'"\n]*?)\.component\.html['"]/g, 'templateUrl: "$1.html"');
  // Generic replacement inside styleUrls arrays (handles multi-line)
  txt = txt.replace(/styleUrls:\s*\[[^\]]*\]/g, block => block.replace(/\.component\.(scss|css)/g, '.$1'));
  // Fallback: any lingering .component.scss/.css anywhere in file
  txt = txt.replace(/\.component\.(scss|css)\b/g, '.$1');
  // Update class declarations
  txt = txt.replace(/(export\s+)?class\s+(\w+)Component\b/g, (m, _exp, c) => m.replace(`${c}Component`, c));
  // Global symbol updates based on full class map
  for (const c of classMap) {
    const refRegex = new RegExp(`\\b${c}Component\\b`, 'g');
    txt = txt.replace(refRegex, c);
  }
  await fs.writeFile(file, txt, 'utf8');
}

async function run() {
  console.log('Scanning for component files under', ROOT);
  const files = (await listFiles(ROOT)).filter(f => f.endsWith('.ts') || f.match(/\.component\.(html|scss|css|spec.ts)$/));
  const componentTs = files.filter(isComponentTs);
  console.log(`Found ${componentTs.length} component TypeScript files.`);
  const log = { renamed: [], transformed: [], timestamp: new Date().toISOString() };
  // Pass 0: collect all TS files
  const allTsFiles = (await listFiles(ROOT)).filter(f => f.endsWith('.ts'));
  // Pass 1: collect ALL component class base names across project
  const classMap = new Set();
  for (const f of allTsFiles) {
    const txt = await fs.readFile(f, 'utf8');
    const re = /(export\s+)?class\s+(\w+)Component\b/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      classMap.add(m[2]);
    }
  }
  if (componentTs.length) {
    for (const tsFile of componentTs) {
      const baseNoComponent = tsFile.replace(/\.component\.ts$/, '.ts');
      await renameFile(tsFile, baseNoComponent); log.renamed.push({ from: tsFile, to: baseNoComponent });
      for (const ext of ['html','scss','css','spec.ts']) {
        const oldAsset = pairedAsset(tsFile, ext);
        if (await pathExists(oldAsset)) {
          const newAsset = oldAsset.replace('.component.', '.');
          await renameFile(oldAsset, newAsset);
          log.renamed.push({ from: oldAsset, to: newAsset });
        }
      }
    }
  } else {
    console.log('No *.component.ts files left – performing reference cleanup only.');
  }
  const tsFilesPost = (await listFiles(ROOT)).filter(f => f.endsWith('.ts'));
  for (const f of tsFilesPost) { await transformTs(f, classMap); log.transformed.push(f); }
  await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2));
  console.log('Rename & transform complete. Log written to', LOG_PATH);
  console.log('Classes updated:', Array.from(classMap).join(', '));
}

run().catch(err => { console.error('Error during rename:', err); process.exit(1); });
