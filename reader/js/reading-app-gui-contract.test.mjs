import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../css/settings-panel.css', import.meta.url), 'utf8');
const immersive = fs.readFileSync(new URL('./immersive-chrome.js', import.meta.url), 'utf8');
const progress = fs.readFileSync(new URL('./semantic-progress.js', import.meta.url), 'utf8');

let assertions = 0;
const check = (run) => {
  run();
  assertions += 1;
};

check(() => assert.match(css, /#settingsBtn::before/));
check(() => assert.match(css, /content: "Aa"/));
check(() => assert.match(css, /body\[data-stage="read"\] \.reading-time \{\s*display: none;/));
check(() => assert.match(css, /\.page-nav \.view-toggle \{\s*display: none !important;/));
check(() => assert.match(css, /\.progress-bar-container\[data-reader-seekable="true"\] \{/));
check(() => assert.match(css, /bottom: calc\(var\(--reader-app-rail-offset\) \+ env\(safe-area-inset-bottom\)\)/));
check(() => assert.match(css, /reader-chrome-hidden \.progress-bar-container/));
check(() => assert.match(css, /#settingsPanel \{\s*place-items: end center;/));
check(() => assert.match(css, /#settingsPanel \.settings-card::before/));
check(() => assert.match(css, /#settingsPanel \.atmosphere-lede \{\s*display: none;/));
check(() => assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/));
check(() => assert.match(css, /@media \(max-width: 700px\)/));
check(() => assert.match(css, /@media \(pointer: coarse\)/));
check(() => assert.match(css, /@media \(forced-colors: active\)/));
check(() => assert.match(css, /@media \(prefers-reduced-motion: reduce\)/));

check(() => assert.match(immersive, /centerChromeIntent/));
check(() => assert.match(immersive, /ratio >= 0\.34 && ratio <= 0\.66/));
check(() => assert.match(immersive, /manualImmersiveAllowed/));
check(() => assert.match(immersive, /body\(\)\.classList\.contains\('reader-chrome-hidden'\)/));
check(() => assert.match(progress, /seekControl\.type = 'range'/));
check(() => assert.match(progress, /seekControl\.setAttribute\('aria-label', 'Seek through book'\)/));
check(() => assert.match(progress, /positionAtProgress/));

console.log(`Reading app GUI contract: ${assertions}/22 assertions passed`);
