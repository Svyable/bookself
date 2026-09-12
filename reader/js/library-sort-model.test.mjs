import assert from 'node:assert/strict';
import {
  normalizeLibrarySort,
  sortByLastRead,
  volumeSlug,
} from './library-sort-model.js';

assert.equal(normalizeLibrarySort('title'), 'title');
assert.equal(normalizeLibrarySort('updated'), 'updated');
assert.equal(normalizeLibrarySort('last-read'), 'last-read');
assert.equal(normalizeLibrarySort('bogus'), 'title');

assert.equal(volumeSlug('#/b/alpha-book/'), 'alpha-book');
assert.equal(volumeSlug('#/b/A%20Book/'), 'A Book');
assert.equal(volumeSlug('#/'), '');

const rows = [
  { title: 'Unread Zebra', lastReadAt: 0 },
  { title: 'Older', lastReadAt: 100 },
  { title: 'Newest', lastReadAt: 300 },
  { title: 'Unread Alpha', lastReadAt: 0 },
  { title: 'Same B', lastReadAt: 200 },
  { title: 'Same A', lastReadAt: 200 },
];

assert.deepEqual(
  sortByLastRead(rows).map((row) => row.title),
  ['Newest', 'Same A', 'Same B', 'Older', 'Unread Alpha', 'Unread Zebra']
);
assert.deepEqual(rows.map((row) => row.title), [
  'Unread Zebra',
  'Older',
  'Newest',
  'Unread Alpha',
  'Same B',
  'Same A',
]);

console.log('Library sort model: 9/9 assertions passed');
