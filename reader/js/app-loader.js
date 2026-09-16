import { prepareReaderFirstRender } from './reader-first-render.js';

console.info('[reader-trace] loader:start');
try {
  await prepareReaderFirstRender();
  console.info('[reader-trace] loader:first-render-ready');
} catch (error) {
  console.warn('Reader first-render preparation could not complete', error);
}

console.info('[reader-trace] loader:app-import:start');
await import('./app.js');
console.info('[reader-trace] loader:app-import:done');
