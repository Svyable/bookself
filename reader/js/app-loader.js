import { prepareReaderFirstRender } from './reader-first-render.js';

try {
  await prepareReaderFirstRender();
} catch (error) {
  console.warn('Reader first-render preparation could not complete', error);
}

await import('./app.js');
