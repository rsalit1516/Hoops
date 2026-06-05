/**
 * Applies the Angular 22 change-detection-eager migration manually.
 * Adds `changeDetection: ChangeDetectionStrategy.Eager` to all @Component
 * decorators that don't already specify a changeDetection strategy.
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

  if (!/@Component\s*\(/.test(original)) continue;
  if (/changeDetection\s*:/.test(original)) continue;

  let content = original;

  // Insert changeDetection right after the opening @Component({
  content = content.replace(
    /@Component\s*\(\s*\{/g,
    '@Component({\n  changeDetection: ChangeDetectionStrategy.Eager,'
  );

  if (content === original) continue;

  // Ensure ChangeDetectionStrategy is in the @angular/core import
  if (!content.includes('ChangeDetectionStrategy')) {
    content = content.replace(
      /import\s*\{([^}]+)\}\s*from\s*['"]@angular\/core['"]/,
      (match, imports) => {
        return `import { ${imports.trim()}, ChangeDetectionStrategy } from '@angular/core'`;
      }
    );
  }

  writeFileSync(filePath, content, 'utf-8');
  modifiedCount++;
  console.log(`Updated: ${path.relative(srcDir, filePath)}`);
}

console.log(`\nDone. Modified ${modifiedCount} files.`);
