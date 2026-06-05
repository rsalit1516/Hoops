/**
 * Second-pass fix: adds ChangeDetectionStrategy to the @angular/core import
 * for files that already have changeDetection: ChangeDetectionStrategy.Eager
 * in their @Component decorator but are missing the import.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'src');

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...walk(full));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts')) {
      files.push(full);
    }
  }
  return files;
}

const files = walk(srcDir);
let modifiedCount = 0;

for (const filePath of files) {
  const original = readFileSync(filePath, 'utf-8');

  // Only fix files that reference ChangeDetectionStrategy but don't import it
  if (!original.includes('ChangeDetectionStrategy')) continue;

  // Check if it's already imported from @angular/core
  if (/import\s*\{[^}]*ChangeDetectionStrategy[^}]*\}\s*from\s*['"]@angular\/core['"]/.test(original)) continue;

  // Needs the import added — inject it into the existing @angular/core import
  const updated = original.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"]/,
    (match, imports) => {
      return `import { ${imports.trim()}, ChangeDetectionStrategy } from '@angular/core'`;
    }
  );

  if (updated === original) {
    console.warn(`WARN: Could not find @angular/core import in ${path.relative(srcDir, filePath)}`);
    continue;
  }

  writeFileSync(filePath, updated, 'utf-8');
  modifiedCount++;
  console.log(`Fixed import: ${path.relative(srcDir, filePath)}`);
}

console.log(`\nDone. Fixed ${modifiedCount} files.`);
