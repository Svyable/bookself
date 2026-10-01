import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';

test('offline shell includes local module dependencies required by Desk safe sync', () => {
  const root = new URL('../', import.meta.url);
  const worker = readFileSync(new URL('sw.js', root), 'utf8');
  const shell = worker.match(/const SHELL = \[([\s\S]*?)\];/)[1];
  const entries = new Set([...shell.matchAll(/'\.\/([^']+)'/g)].map(m => m[1]));
  for (const name of readdirSync(new URL('js/', root)).filter(n => n.endsWith('.js'))) {
    const module = new URL(`js/${name}`, root);
    const source = readFileSync(module, 'utf8');
    for (const match of source.matchAll(/["'](?:\.\.\/)?(css\/[^"'?]+\.css)(?:\?[^"']*)?["']/g)) {
      assert.ok(entries.has(match[1]), `${name} loads ${match[1]}, missing from deployable shell`);
    }
    for (const match of source.matchAll(/(?:from\s*|import\s*\(?\s*)['"](\.[^'"]+)['"]/g)) {
      const dependency = new URL(match[1], module);
      dependency.search = '';
      const path = dependency.pathname.slice(root.pathname.length);
      assert.ok(entries.has(path), `${name} depends on ${path}, missing from deployable shell`);
    }
  }
});
