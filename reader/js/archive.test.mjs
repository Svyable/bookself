import assert from 'node:assert/strict';
import { crc32, zipStore } from './archive.js';

const encoder = new TextEncoder();
assert.equal(crc32(encoder.encode('123456789')), 0xcbf43926);

const binary = new Uint8Array(128 * 1024);
for (let i = 0; i < binary.length; i += 1) binary[i] = i % 251;

const zip = zipStore([
  ['mimetype', 'application/epub+zip'],
  ['EPUB/binary.bin', binary],
], new Date(2026, 7, 25, 7, 0, 0));

assert.deepEqual([...zip.slice(0, 4)], [0x50, 0x4b, 0x03, 0x04]);
const view = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
const nameLength = view.getUint16(26, true);
assert.equal(new TextDecoder().decode(zip.slice(30, 30 + nameLength)), 'mimetype');
assert.match(new TextDecoder().decode(zip), /EPUB\/binary\.bin/);
assert.deepEqual([...zip.slice(-22, -18)], [0x50, 0x4b, 0x05, 0x06]);
assert.throws(() => zipStore({ '../escape.txt': 'no' }), /Unsafe archive path/);
assert.throws(() => zipStore({ 'safe/../../escape.txt': 'no' }), /Unsafe archive path/);

console.log('archive tests ok');
