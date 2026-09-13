import assert from 'node:assert/strict';

Object.defineProperty(globalThis, 'navigator', {
  value: { connection: {} },
  configurable: true,
});
globalThis.window = {
  location: {
    hostname: 'example.invalid',
    pathname: '/reader/',
    hash: '#/',
    search: '',
  },
  addEventListener() {},
};
globalThis.location = globalThis.window.location;

const { normalizeReaderStyles } = await import('./imprint.js');

assert.deepEqual(
  normalizeReaderStyles([
    'reader/css/custom.css?v=7',
    './reader/css/print.css#latest',
    'reader/css/custom.css?v=7',
    '../escape.css',
    'https://example.com/remote.css',
    '/absolute.css',
    'reader/js/not-css.js?v=1',
  ]),
  ['reader/css/custom.css?v=7', 'reader/css/print.css#latest']
);

console.log('imprint style policy tests ok');
