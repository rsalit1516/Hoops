#!/usr/bin/env node
/**
 * fix-component-symbols.mjs
 * Second-stage cleanup after removing `.component` from filenames and class names.
 * Replaces lingering symbol references like FooComponent with Foo across:
 *  - import specifiers
 *  - dynamic import thunks (mod.FooComponent)
 *  - route definitions { component: FooComponent }
 *  - TestBed / ComponentFixture usages
 *  - describe('FooComponent') blocks
 */
import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'src/app');
let replacements = 0; let filesTouched = 0;

async function listTs(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await listTs(full));
    else if (full.endsWith('.ts')) out.push(full);
  }
  return out;
}

function buildClassMap(content) {
  const map = new Set();
  const re = /export\s+class\s+(\w+)\b/g;
  let m;
  while ((m = re.exec(content)) !== null) map.add(m[1]);
  return map;
}

async function collectAllExports(files) {
  const set = new Set();
  for (const f of files) {
    const txt = await fs.readFile(f, 'utf8');
    for (const c of buildClassMap(txt)) set.add(c);
  }
  return set;
}

function transform(content, classSet) {
  // For each class name N, replace NComponent tokens with N
  // Build one regex across all names for efficiency if large.
  const pattern = Array.from(classSet).map(n => `${n}Component`).join('|');
  if (!pattern) return content;
  const tokenRe = new RegExp(`\\b(${pattern})\\b`, 'g');
  return content.replace(tokenRe, (full, grp) => {
    const base = grp.replace(/Component$/, '');
    replacements++; return base; });
}

async function run() {
  const files = await listTs(ROOT);
  const exportSet = await collectAllExports(files);
  for (const f of files) {
    let txt = await fs.readFile(f, 'utf8');
    const before = txt;
    // import { FooComponent } => import { Foo }
    txt = txt.replace(/import\s*{([^}]+)}/g, block => {
      return block.replace(/\b(\w+)Component\b/g, (m, name) => exportSet.has(name) ? name : m);
    });
    // dynamic import then mappings: mod.FooComponent => mod.Foo
    txt = txt.replace(/(mod|m|cmp|c)\.(\w+)Component\b/g, (m, pfx, name) => exportSet.has(name) ? `${pfx}.${name}` : m);
    // Route component: component: FooComponent
    txt = txt.replace(/component:\s*(\w+)Component\b/g, (m, name) => exportSet.has(name) ? `component: ${name}` : m);
    // TestBed.createComponent(FooComponent)
    txt = txt.replace(/createComponent\((\w+)Component\b/g, (m, name) => exportSet.has(name) ? `createComponent(${name}` : m);
    // ComponentFixture<FooComponent>
    txt = txt.replace(/ComponentFixture<([A-Z]\w+)Component>/g, (m, name) => exportSet.has(name) ? `ComponentFixture<${name}>` : m);
    // describe('FooComponent'
    txt = txt.replace(/describe\(['"]([A-Z]\w+)Component(['"])\)/g, (m, name, q) => exportSet.has(name) ? `describe(${q}${name}${q})` : m);
    // Imports arrays / declarations arrays listing FooComponent
    txt = transform(txt, exportSet);
    if (txt !== before) { await fs.writeFile(f, txt, 'utf8'); filesTouched++; }
  }
  console.log(`Fix complete. Files touched: ${filesTouched}, replacements: ${replacements}`);
}

run().catch(e => { console.error(e); process.exit(1); });
