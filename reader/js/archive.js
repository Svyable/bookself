const encoder = new TextEncoder();
let crcTable = null;

function toBytes(value) {
  if (value instanceof Uint8Array) return value;
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  return encoder.encode(String(value ?? ''));
}

function entriesOf(files) {
  if (Array.isArray(files)) return files;
  if (files instanceof Map) return [...files.entries()];
  return Object.entries(files || {});
}

function safeArchivePath(value) {
  const path = String(value || '').replace(/^\/+/, '');
  if (!path || path.includes('\0') || path.split('/').includes('..')) {
    throw new Error(`Unsafe archive path: ${value}`);
  }
  return path;
}

function getCrcTable() {
  if (crcTable) return crcTable;
  crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    crcTable[n] = c >>> 0;
  }
  return crcTable;
}

export function crc32(value) {
  const bytes = toBytes(value);
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosStamp(stamp = new Date()) {
  const date = stamp instanceof Date && !Number.isNaN(stamp.getTime()) ? stamp : new Date();
  const year = Math.max(1980, date.getFullYear());
  return {
    time: ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | (Math.floor(date.getSeconds() / 2) & 31),
    date: (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31),
  };
}

function write16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function write32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

function concatChunks(chunks, total) {
  const out = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.length;
  }
  return out;
}

/**
 * Create a ZIP archive using the store method (no compression).
 * Keeping this small and dependency-free is useful for both starter bundles
 * and standards-based publication containers such as EPUB.
 */
export function zipStore(files, stamp = new Date()) {
  const rows = entriesOf(files);
  if (rows.length > 0xffff) throw new Error('Archive has too many files');

  const localChunks = [];
  const centralChunks = [];
  let localLength = 0;
  let centralLength = 0;
  const { time, date } = dosStamp(stamp);

  for (const [rawName, rawData] of rows) {
    const name = safeArchivePath(rawName);
    const filename = encoder.encode(name);
    const data = toBytes(rawData);
    if (filename.length > 0xffff) throw new Error(`Archive path is too long: ${name}`);
    if (data.length > 0xffffffff) throw new Error(`Archive file is too large: ${name}`);

    const crc = crc32(data);
    const localHeader = new Uint8Array(30);
    const lv = new DataView(localHeader.buffer);
    write32(lv, 0, 0x04034b50);
    write16(lv, 4, 20);
    write16(lv, 6, 0x0800); // UTF-8 names.
    write16(lv, 8, 0); // Stored, not compressed.
    write16(lv, 10, time);
    write16(lv, 12, date);
    write32(lv, 14, crc);
    write32(lv, 18, data.length);
    write32(lv, 22, data.length);
    write16(lv, 26, filename.length);
    write16(lv, 28, 0); // No extra field.

    const centralHeader = new Uint8Array(46);
    const cv = new DataView(centralHeader.buffer);
    write32(cv, 0, 0x02014b50);
    write16(cv, 4, 20);
    write16(cv, 6, 20);
    write16(cv, 8, 0x0800);
    write16(cv, 10, 0);
    write16(cv, 12, time);
    write16(cv, 14, date);
    write32(cv, 16, crc);
    write32(cv, 20, data.length);
    write32(cv, 24, data.length);
    write16(cv, 28, filename.length);
    write16(cv, 30, 0);
    write16(cv, 32, 0);
    write16(cv, 34, 0);
    write16(cv, 36, 0);
    write32(cv, 38, 0);
    write32(cv, 42, localLength);

    localChunks.push(localHeader, filename, data);
    centralChunks.push(centralHeader, filename);
    localLength += localHeader.length + filename.length + data.length;
    centralLength += centralHeader.length + filename.length;
  }

  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  write32(ev, 0, 0x06054b50);
  write16(ev, 4, 0);
  write16(ev, 6, 0);
  write16(ev, 8, rows.length);
  write16(ev, 10, rows.length);
  write32(ev, 12, centralLength);
  write32(ev, 16, localLength);
  write16(ev, 20, 0);

  return concatChunks([...localChunks, ...centralChunks, end], localLength + centralLength + end.length);
}
