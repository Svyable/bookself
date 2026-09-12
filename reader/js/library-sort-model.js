export function volumeSlug(href = '') {
  const match = String(href).match(/#\/b\/([^/]+)\//);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function sortByLastRead(rows = []) {
  return rows.slice().sort((a, b) => {
    const aRead = Number(a.lastReadAt) || 0;
    const bRead = Number(b.lastReadAt) || 0;
    if (aRead !== bRead) return bRead - aRead;
    return String(a.title || '').localeCompare(String(b.title || ''), undefined, {
      sensitivity: 'base',
    });
  });
}
