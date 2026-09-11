const CHECKLIST_RE = /^- \[([ xX])\] \[([^\]]+)\]\((manuscript\/[^)\s]+)\)/gm;

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function parseManuscriptChecklist(markdown = '') {
  const entries = [];
  CHECKLIST_RE.lastIndex = 0;
  let match;
  while ((match = CHECKLIST_RE.exec(markdown))) {
    entries.push({
      checked: match[1].toLowerCase() === 'x',
      title: match[2].trim(),
      file: match[3].replace(/^\.\//, ''),
    });
  }
  return entries;
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'book';
}

function inlineMarkdown(text = '') {
  let out = escapeHtml(text);
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<img src="$2" alt="$1">');
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<a href="$2">$1</a>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  out = out.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  out = out.replace(/(?<!_)_([^_\n]+)_(?!_)/g, '<em>$1</em>');
  return out;
}

export function markdownToKdpHtml(markdown = '') {
  const lines = String(markdown).replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let paragraph = [];
  let listType = '';
  let inCode = false;
  let code = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' ').trim())}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    out.push(`</${listType}>`);
    listType = '';
  };

  for (const line of lines) {
    if (/^```/.test(line)) {
      flushParagraph();
      closeList();
      if (inCode) {
        out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      code.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      closeList();
      const level = Math.min(6, heading[1].length + 1);
      out.push(`<h${level}>${inlineMarkdown(heading[2].trim())}</h${level}>`);
      continue;
    }

    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) {
      flushParagraph();
      closeList();
      out.push('<hr>');
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const nextType = ordered ? 'ol' : 'ul';
      if (listType && listType !== nextType) closeList();
      if (!listType) {
        listType = nextType;
        out.push(`<${listType}>`);
      }
      out.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      closeList();
      out.push(`<blockquote><p>${inlineMarkdown(quote[1])}</p></blockquote>`);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      closeList();
      continue;
    }

    paragraph.push(line.trim());
  }

  if (inCode) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
  flushParagraph();
  closeList();
  return out.join('\n');
}

export function buildKdpHtml({ title, author, chapters }) {
  const safeTitle = escapeHtml(title || 'Untitled');
  const safeAuthor = escapeHtml(author || '');
  const toc = chapters.map((chapter, index) => {
    const id = `chapter-${index + 1}-${slugify(chapter.title)}`;
    return `<li><a href="#${id}">${escapeHtml(chapter.title)}</a></li>`;
  }).join('\n');
  const body = chapters.map((chapter, index) => {
    const id = `chapter-${index + 1}-${slugify(chapter.title)}`;
    return `<section class="chapter" id="${id}">\n<h1>${escapeHtml(chapter.title)}</h1>\n${markdownToKdpHtml(chapter.markdown)}\n</section>`;
  }).join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; line-height: 1.55; margin: 5%; max-width: 42em; }
  .title-page { text-align: center; margin: 28vh 0 18vh; }
  .title-page h1 { font-size: 2.2em; margin-bottom: .35em; }
  .title-page p { font-size: 1.15em; }
  nav { page-break-after: always; break-after: page; }
  nav h1 { font-size: 1.5em; }
  nav ol { padding-left: 1.4em; }
  .chapter { page-break-before: always; break-before: page; }
  .chapter > h1 { font-size: 1.8em; margin-top: 0; }
  h2, h3, h4, h5, h6 { break-after: avoid; }
  p { margin: 0 0 1em; }
  blockquote { margin: 1em 1.5em; }
  pre { white-space: pre-wrap; overflow-wrap: anywhere; }
  img { max-width: 100%; height: auto; }
  a { color: inherit; }
</style>
</head>
<body>
<section class="title-page">
  <h1>${safeTitle}</h1>
  ${safeAuthor ? `<p>${safeAuthor}</p>` : ''}
</section>
<nav aria-label="Table of contents">
  <h1>Contents</h1>
  <ol>${toc}</ol>
</nav>
${body}
</body>
</html>`;
}

function parseRepo(value = '') {
  const raw = String(value).trim();
  const github = raw.match(/github\.com\/([^/]+)\/([^/#?]+)/i);
  const pair = github ? `${github[1]}/${github[2]}` : raw.replace(/^https?:\/\//i, '');
  const match = pair.match(/^([^/\s]+)\/([^/\s]+)$/);
  return match ? { owner: match[1], repo: match[2].replace(/\.git$/i, '') } : null;
}

function currentWorkspace() {
  const params = new URLSearchParams(location.search);
  const remote = parseRepo(params.get('repo') || '');
  if (remote) return { remote: true, ...remote };
  return { remote: false };
}

async function readText(path) {
  const workspace = currentWorkspace();
  if (!workspace.remote) {
    const response = await fetch(new URL(`../${path}`, location.href), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not read ${path}`);
    return response.text();
  }

  const repoInput = document.getElementById('repoInput');
  const repo = parseRepo(repoInput?.value || '') || workspace;
  const metaResponse = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!metaResponse.ok) throw new Error('Could not read repository metadata');
  const meta = await metaResponse.json();
  const branch = meta.default_branch || 'main';
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/${branch}/${encodedPath}`, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not read ${path}`);
  return response.text();
}

function downloadText(filename, text, type = 'text/html;charset=utf-8') {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportCard(card, trigger) {
  const slug = card.dataset.slug;
  const title = card.querySelector('.book-title')?.textContent?.trim() || slug;
  const author = card.querySelector('.book-authors')?.textContent?.trim() || '';
  const previous = trigger.textContent;
  trigger.textContent = 'Building…';
  trigger.setAttribute('aria-busy', 'true');

  try {
    const hub = await readText(`books/${slug}/README.md`);
    const files = parseManuscriptChecklist(hub);
    if (!files.length) throw new Error('No manuscript checklist entries found in this book hub.');
    const chapters = await Promise.all(files.map(async (entry) => ({
      title: entry.title,
      markdown: await readText(`books/${slug}/${entry.file}`),
    })));
    const html = buildKdpHtml({ title, author: author === 'Author not set' ? '' : author, chapters });
    downloadText(`${slugify(title)}-kindle.html`, html);
    trigger.textContent = 'Downloaded';
    setTimeout(() => { trigger.textContent = previous; }, 1600);
  } catch (error) {
    console.error('KDP export failed', error);
    trigger.textContent = 'Export failed';
    trigger.title = error?.message || 'Could not export this manuscript.';
    setTimeout(() => { trigger.textContent = previous; }, 2200);
  } finally {
    trigger.removeAttribute('aria-busy');
  }
}

function bindKdpExport() {
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('.export-kdp-action');
    if (!trigger) return;
    event.preventDefault();
    const card = trigger.closest('.book-card');
    if (card) exportCard(card, trigger);
  });
}

if (typeof document !== 'undefined') bindKdpExport();
