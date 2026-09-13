import assert from 'node:assert/strict';
import {
  SOUNDSCAPE_SCENES,
  DEFAULT_SCENE,
  DEFAULT_VOLUME,
  normalizeScene,
  normalizeVolume,
  parseSoundscapePreferences,
  soundscapeState,
  soundscapeButtonModel,
} from './soundscape-model.js';

assert.equal(SOUNDSCAPE_SCENES.length >= 4, true);
assert.equal(SOUNDSCAPE_SCENES[0].id, 'off');

assert.equal(DEFAULT_SCENE, 'off');
assert.equal(DEFAULT_VOLUME, 55);

const ids = new Set(SOUNDSCAPE_SCENES.map((scene) => scene.id));
assert.equal(ids.size, SOUNDSCAPE_SCENES.length);

assert.equal(normalizeScene('rain'), 'rain');
assert.equal(normalizeScene('fire'), 'fire');
assert.equal(normalizeScene('off'), 'off');
assert.equal(normalizeScene('thunder'), null);
assert.equal(normalizeScene(undefined), null);
assert.equal(normalizeScene(42), null);

assert.equal(normalizeVolume(55), 55);
assert.equal(normalizeVolume('80'), 80);
assert.equal(normalizeVolume(104), 100);
assert.equal(normalizeVolume(-4), 0);
assert.equal(normalizeVolume(33.4), 33);
assert.equal(normalizeVolume(null), null);
assert.equal(normalizeVolume(''), null);
assert.equal(normalizeVolume('loud'), null);

assert.deepEqual(parseSoundscapePreferences(null), { scene: 'off', volume: DEFAULT_VOLUME });
assert.deepEqual(parseSoundscapePreferences('{"scene":"waves","volume":60}'), { scene: 'waves', volume: 60 });
assert.deepEqual(parseSoundscapePreferences('{"scene":"thunder","volume":"huge"}'), { scene: 'off', volume: DEFAULT_VOLUME });
assert.deepEqual(parseSoundscapePreferences({ scene: 'night', volume: 30 }), { scene: 'night', volume: 30 });
assert.deepEqual(parseSoundscapePreferences('not json'), { scene: 'off', volume: DEFAULT_VOLUME });

const on = soundscapeState({ scene: 'rain', volume: 50, supported: true });
assert.equal(on.active, true);
assert.equal(on.scene, 'rain');
assert.equal(on.volume, 50);
assert.equal(on.label, 'Rain');

const off = soundscapeState({ scene: 'off', volume: 40, supported: true });
assert.equal(off.active, false);
assert.equal(off.label, 'Silence');

const unsupportedActive = soundscapeState({ scene: 'rain', volume: 40, supported: false });
assert.equal(unsupportedActive.active, false);

const clamped = soundscapeState({ scene: 'night', volume: 9001, supported: true });
assert.equal(clamped.volume, 100);
assert.equal(clamped.scene, 'night');

const button = soundscapeButtonModel('fire', { active: true });
assert.equal(button.id, 'fire');
assert.equal(button.label, 'Hearth');
assert.equal(button.pressed, true);
assert.equal(button.disabled, false);

assert.equal(soundscapeButtonModel('thunder', { active: true }), null);

for (const scene of SOUNDSCAPE_SCENES) {
  const model = soundscapeButtonModel(scene.id, {});
  assert.ok(model);
  assert.equal(model.pressed, false);
  assert.equal(model.disabled, false);
}

console.log('soundscape-model.test.mjs passed');