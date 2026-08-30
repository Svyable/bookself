function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sourceLines(markdown) {
  const source = String(markdown || '').replace(/\r\n?/g, '\n');
  const lines = [];
  let start = 0;
  while (start < source.length) {
    const newline = source.indexOf('\n', start);
    const end = newline === -1 ? source.length : newline + 1;
    lines.push({ text: source.slice(start, newline === -1 ? source.length : newline), start, end });
    start = end;
  }
  if (!source.length) lines.push({ text: '', start: 0, end: 0 });
  return { source, lines };
}

function clean(value) {
  return String(value || '').trim();
}

function forcedScene(value) {
  const line = clean(value);
  return /^\.[A-Za-z0-9]/.test(line) ? line.slice(1).trim() : '';
}

export function screenplaySceneHeading(value) {
  const line = clean(value);
  const forced = forcedScene(line);
  if (forced) return forced;
  return /^(?:INT|EXT|EST|INT\.\/EXT|INT\/EXT|I\/E)(?:\.|\s)/i.test(line) ? line : '';
}

function centeredText(value) {
  const match = clean(value).match(/^>\s*(.+?)\s*<$/);
  return match ? match[1].trim() : '';
}

function transitionText(value) {
  const line = clean(value);
  if (!line || centeredText(line)) return '';
  if (line.startsWith('>')) return line.slice(1).trim();
  if (/[A-Z]/.test(line) && line === line.toUpperCase() && /TO:$/.test(line)) return line;
  return '';
}

function sectionText(value) {
  const match = String(value || '').match(/^(#{1,6})\s+(.+)$/);
  return match ? { depth: match[1].length, title: match[2].trim() } : null;
}

function stripCharacterSyntax(value) {
  return clean(value)
    .replace(/^@/, '')
    .replace(/\s*\^\s*$/, '')
    .replace(/^\*\*(.+)\*\*$/, '$1')
    .trim();
}

export function screenplayCharacter(value) {
  return stripCharacterSyntax(value)
    .replace(/\s+\((?:V\.?O\.?|O\.?S\.?|CONT['’]?D|OFF SCREEN|VOICE OVER)\)\s*$/i, '')
    .trim();
}

function isCharacterAt(lines, index) {
  const raw = clean(lines[index]?.text);
  if (!raw) return false;
  if (screenplaySceneHeading(raw) || transitionText(raw) || centeredText(raw) || sectionText(raw)) return false;
  if (raw.startsWith('@')) return !!clean(lines[index + 1]?.text);
  const cue = stripCharacterSyntax(raw);
  const hasLetter = /[A-Z]/i.test(cue);
  const uppercase = cue === cue.toUpperCase();
  const previousBlank = index === 0 || !clean(lines[index - 1]?.text);
  const nextNonBlank = !!clean(lines[index + 1]?.text);
  return previousBlank && nextNonBlank && hasLetter && uppercase;
}

function isParenthetical(value) {
  const line = clean(value);
  return /^\(.+\)$/.test(line);
}

function elementEnd(lines, lastIndex, fallback) {
  return lines[lastIndex]?.end ?? fallback;
}

export function parseScreenplay(markdown) {
  const { source, lines } = sourceLines(markdown);
  const elements = [];
  const turns = [];
  const outline = [];
  let scene = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const raw = clean(line.text);
    if (!raw) {
      i += 1;
      continue;
    }

    const section = sectionText(raw);
    if (section) {
      outline.push({ level: 1, title: section.title, offset: line.start, section: true });
      elements.push({ type: 'section', ...section, start: line.start, end: line.end, raw: source.slice(line.start, line.end) });
      i += 1;
      continue;
    }

    const sceneHeading = screenplaySceneHeading(raw);
    if (sceneHeading) {
      scene = sceneHeading;
      outline.push({ level: 2, title: sceneHeading, offset: line.start });
      elements.push({ type: 'scene', text: sceneHeading, start: line.start, end: line.end, raw: source.slice(line.start, line.end) });
      i += 1;
      continue;
    }

    const centered = centeredText(raw);
    if (centered) {
      elements.push({ type: 'centered', text: centered, start: line.start, end: line.end, raw: source.slice(line.start, line.end) });
      i += 1;
      continue;
    }

    const transition = transitionText(raw);
    if (transition) {
      elements.push({ type: 'transition', text: transition, start: line.start, end: line.end, raw: source.slice(line.start, line.end) });
      i += 1;
      continue;
    }

    if (/^={3,}$/.test(raw)) {
      elements.push({ type: 'page-break', start: line.start, end: line.end, raw: source.slice(line.start, line.end) });
      i += 1;
      continue;
    }

    if (isCharacterAt(lines, i)) {
      const cueRaw = raw;
      const cue = stripCharacterSyntax(cueRaw);
      const character = screenplayCharacter(cueRaw);
      const dual = /\^\s*$/.test(cueRaw);
      const start = line.start;
      const dialogue = [];
      const parentheticals = [];
      i += 1;
      let last = i - 1;
      while (i < lines.length && clean(lines[i].text)) {
        const text = clean(lines[i].text);
        if (isParenthetical(text)) parentheticals.push({ text, index: dialogue.length });
        dialogue.push({ text, parenthetical: isParenthetical(text) });
        last = i;
        i += 1;
      }
      const end = elementEnd(lines, last, line.end);
      const turn = {
        type: 'dialogue', cue, character, dual, scene,
        lines: dialogue,
        parentheticals,
        dialogue: dialogue.filter((entry) => !entry.parenthetical).map((entry) => entry.text).join('\n'),
        start,
        end,
        raw: source.slice(start, end),
      };
      elements.push(turn);
      turns.push(turn);
      continue;
    }

    const actionStart = line.start;
    const actionLines = [];
    let last = i;
    while (i < lines.length && clean(lines[i].text)) {
      if (i !== last && (
        screenplaySceneHeading(lines[i].text)
        || transitionText(lines[i].text)
        || centeredText(lines[i].text)
        || sectionText(lines[i].text)
        || /^={3,}$/.test(clean(lines[i].text))
        || isCharacterAt(lines, i)
      )) break;
      let text = String(lines[i].text || '');
      if (actionLines.length === 0 && /^!/.test(clean(text))) text = text.replace(/^\s*!/, '');
      actionLines.push(text.trim());
      last = i;
      i += 1;
    }
    const end = elementEnd(lines, last, line.end);
    elements.push({
      type: 'action',
      lines: actionLines,
      text: actionLines.join('\n'),
      start: actionStart,
      end,
      raw: source.slice(actionStart, end),
    });
  }

  return { elements, turns, outline };
}

export function isScreenplayText(markdown) {
  const parsed = parseScreenplay(markdown);
  return parsed.outline.some((item) => !item.section) && parsed.turns.length > 0;
}

export function screenplayOutline(markdown) {
  return parseScreenplay(markdown).outline.map(({ level, title, offset }) => ({ level, title, offset }));
}

function inline(value, renderInline) {
  const text = String(value || '');
  if (typeof renderInline === 'function') return renderInline(text);
  return escapeHtml(text);
}

function linesHtml(lines, renderInline) {
  return lines.map((line) => inline(line, renderInline)).join('<br>\n');
}

export function screenplayBlocks(markdown, renderInline) {
  return parseScreenplay(markdown).elements
    .filter((element) => element.type !== 'section')
    .map((element) => {
      let html = '';
      if (element.type === 'scene') {
        html = `<h2 class="screenplay-scene">${inline(element.text, renderInline)}</h2>`;
      } else if (element.type === 'transition') {
        html = `<p class="screenplay-transition">${inline(element.text, renderInline)}</p>`;
      } else if (element.type === 'centered') {
        html = `<p class="screenplay-centered">${inline(element.text, renderInline)}</p>`;
      } else if (element.type === 'page-break') {
        html = '<hr class="screenplay-page-break">';
      } else if (element.type === 'dialogue') {
        const lines = element.lines.map((entry) => (
          entry.parenthetical
            ? `<p class="screenplay-parenthetical">${inline(entry.text, renderInline)}</p>`
            : `<p class="screenplay-dialogue-line">${inline(entry.text, renderInline)}</p>`
        )).join('');
        html = `<section class="screenplay-dialogue-block${element.dual ? ' screenplay-dual' : ''}" data-screenplay-character="${escapeHtml(element.character)}"><p class="screenplay-character">${inline(element.cue, renderInline)}</p>${lines}</section>`;
      } else {
        html = `<p class="screenplay-action">${linesHtml(element.lines || [element.text], renderInline)}</p>`;
      }
      return { ...element, html };
    });
}

export function screenplayTurns(markdown, chapter = '', chapterIndex = 0) {
  return parseScreenplay(markdown).turns.map((turn) => ({ ...turn, chapter, chapterIndex }));
}
