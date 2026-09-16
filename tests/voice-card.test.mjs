import assert from 'node:assert/strict';
import { decorateVoiceCards, isVoiceCardHtml } from '../reader/js/voice-card.js';

const candidate = `<blockquote>\n<p><strong>NICK / THE RULES</strong></p>\n<h3>“We hate the Yankees.”</h3>\n<p><em>State Department briefing · <a href="https://example.com">source</a></em></p>\n</blockquote>`;
const decorated = decorateVoiceCards(candidate);

assert.match(decorated, /<blockquote class="voice-card"/);
assert.match(decorated, /data-voice-label="NICK"/);
assert.match(decorated, /data-voice-theme="THE RULES"/);
assert.match(decorated, /class="voice-card__label"/);
assert.match(decorated, /class="voice-card__quote"/);
assert.match(decorated, /class="voice-card__source"/);
assert.match(decorated, /href="https:\/\/example\.com"/);
assert.equal(isVoiceCardHtml(decorated), true);

const ordinary = `<blockquote>\n<p><strong>Ordinary emphasis</strong></p>\n<p>This is not a voice card.</p>\n</blockquote>`;
assert.equal(decorateVoiceCards(ordinary), ordinary);
assert.equal(isVoiceCardHtml(ordinary), false);

const malformed = `<blockquote>\n<p><strong>NICK / THEME</strong></p>\n<h3>Quote</h3>\n<p>Source without emphasis</p>\n</blockquote>`;
assert.equal(decorateVoiceCards(malformed), malformed);

const mixed = `<p>Before</p>${candidate}<p>After</p>`;
const mixedDecorated = decorateVoiceCards(mixed);
assert.match(mixedDecorated, /^<p>Before<\/p><blockquote class="voice-card"/);
assert.match(mixedDecorated, /<\/blockquote><p>After<\/p>$/);

console.log('voice card tests ok');
