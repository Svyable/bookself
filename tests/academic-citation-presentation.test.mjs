import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../reader/css/academic.css', import.meta.url), 'utf8');
const docs = await readFile(new URL('../docs/academic-writing.md', import.meta.url), 'utf8');

assert.match(css, /\.reader-reference\s*\{[\s\S]*text-indent:\s*calc\(-1 \* var\(--reference-indent\)\)/, 'references should keep a scholarly hanging indent');
assert.match(css, /\.reader-footnote-marker[\s\S]*vertical-align:\s*0\.52em/, 'footnote markers should remain typographically superscripted');
assert.match(css, /content:\s*" ↗"/, 'screen citations should expose a restrained external-source affordance');
assert.match(css, /content:\s*" <" attr\(href\) ">"/, 'print citations should expose the original destination URL');
assert.match(css, /@media \(max-width: 640px\), \(pointer: coarse\)/, 'compact readers should keep the citation bottom-sheet treatment');

assert.match(docs, /Chicago-style\s+notes are a strong default/i, 'narrative nonfiction should document the notes-and-bibliography default');
assert.match(docs, /Preparing for the International Age/, 'documentation should use a real descriptive source-title example');
assert.match(docs, /\[primary source\]/, 'documentation should explicitly identify generic source labels as an anti-pattern');
assert.match(docs, /Name of the record readers are opening/i, 'source-link guidance should require descriptive record names');

console.log('academic citation presentation tests ok');
