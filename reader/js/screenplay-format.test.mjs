import assert from 'node:assert/strict';
import test from 'node:test';

import {
  isScreenplayText,
  parseScreenplay,
  screenplayBlocks,
  screenplayCharacter,
  screenplayOutline,
  screenplaySceneHeading,
  screenplayTurns,
} from './screenplay-format.js';

const SAMPLE = `# ACT ONE

INT. WRITER'S ROOM - DAY

Rain stipples the windows.

MARA
(quietly)
We can keep arguing about the ending.

ELI (V.O.)
Or we can write the scene and find out.

CUT TO:

EXT. CITY STREET - NIGHT

> THE END <
`;

test('detects screenplay from scene headings even without dialogue', () => {
  assert.equal(isScreenplayText('INT. ROOM - DAY\n\nA chair waits.\n'), true);
  assert.equal(isScreenplayText('# Ordinary chapter\n\nA chair waits.\n'), false);
});

test('recognizes standard and forced scene headings', () => {
  assert.equal(screenplaySceneHeading('INT. ROOM - DAY'), 'INT. ROOM - DAY');
  assert.equal(screenplaySceneHeading('.MONTAGE - VARIOUS'), 'MONTAGE - VARIOUS');
  assert.equal(screenplaySceneHeading('A room at night.'), '');
});

test('parses scenes, dialogue, parentheticals, transitions, and centered text', () => {
  const parsed = parseScreenplay(SAMPLE);
  assert.deepEqual(parsed.turns.map((turn) => turn.character), ['MARA', 'ELI']);
  assert.equal(parsed.turns[0].parentheticals[0].text, '(quietly)');
  assert.equal(parsed.turns[0].dialogue, 'We can keep arguing about the ending.');
  assert.equal(parsed.turns[1].scene, "INT. WRITER'S ROOM - DAY");
  assert.ok(parsed.elements.some((element) => element.type === 'transition' && element.text === 'CUT TO:'));
  assert.ok(parsed.elements.some((element) => element.type === 'centered' && element.text === 'THE END'));
});

test('sections are outline-only while scenes remain navigable', () => {
  const outline = screenplayOutline(SAMPLE);
  assert.deepEqual(outline.map((item) => item.title), [
    'ACT ONE',
    "INT. WRITER'S ROOM - DAY",
    'EXT. CITY STREET - NIGHT',
  ]);
  const html = screenplayBlocks(SAMPLE).map((block) => block.html).join('\n');
  assert.equal(html.includes('ACT ONE'), false);
  assert.ok(html.includes("INT. WRITER&#39;S ROOM - DAY"));
});

test('forced action prevents uppercase prose from becoming a character cue', () => {
  const parsed = parseScreenplay(`INT. LAB - NIGHT\n\n!THE GENERATOR HUMS\nStill too loud.\n\nMARA\nTurn it off.\n`);
  assert.equal(parsed.turns.length, 1);
  assert.equal(parsed.turns[0].character, 'MARA');
  assert.ok(parsed.elements.some((element) => element.type === 'action' && element.text.startsWith('THE GENERATOR HUMS')));
});

test('forced character cues and extensions normalize to a rehearsal role', () => {
  assert.equal(screenplayCharacter('@DR. RIVERA (O.S.)'), 'DR. RIVERA');
  const turns = screenplayTurns(`INT. HALL - DAY\n\n@DR. RIVERA (O.S.)\nCome in.\n`, 'script', 2);
  assert.equal(turns[0].character, 'DR. RIVERA');
  assert.equal(turns[0].chapter, 'script');
  assert.equal(turns[0].chapterIndex, 2);
});

test('explicit page breaks and dual-dialogue markers survive parsing', () => {
  const parsed = parseScreenplay(`INT. ROOM - DAY\n\nMARA\nFirst.\n\n===\n\nELI ^\nSecond.\n`);
  assert.ok(parsed.elements.some((element) => element.type === 'page-break'));
  assert.equal(parsed.turns[1].dual, true);
});
