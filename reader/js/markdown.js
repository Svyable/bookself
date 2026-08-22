import { fileUrl } from './base.js';

function rewriteMediaUrls(html, slug) {
  const prefix = fileUrl(`books/${slug}/`);
  return html.replace(
    /(src|href)=["'](\.\.\/media\/[^"']+)["']/gi,
    (_, attr, rel) => {
      const path = rel.replace(/^\.\.\//, '');
      return `${attr}="${prefix}${path}"`;
    }
  );
}

export function renderMarkdown(markdown, slug) {
  const raw = window.marked.parse(markdown, { gfm: true, breaks: false });
  return rewriteMediaUrls(raw, slug);
}

export function blocksFromMarkdown(markdown, slug) {
  const tokens = window.marked.lexer(markdown);
  const blocks = [];
  let offset = 0;
  for (const token of tokens) {
    const raw = token.raw ?? '';
    const start = offset;
    const end = offset + raw.length;
    offset = end;
    if (token.type === 'space' || raw.trim() === '') continue;
    const html = rewriteMediaUrls(window.marked.parser([token]), slug);
    blocks.push({ html, start, end, raw });
  }
  if (blocks.length === 0) {
    blocks.push({
      html: '<p></p>',
      start: 0,
      end: markdown.length,
      raw: markdown,
    });
  }
  return blocks;
}
