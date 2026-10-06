import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/services/session.js', import.meta.url), 'utf8');
const session = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const values = new Map();
globalThis.localStorage = {
  getItem: (key) => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: (key) => values.delete(key),
};
const token = (exp) => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;

test('validates JWT expiry, including the exact expiry boundary and malformed tokens', () => {
  assert.equal(session.tokenIsValid(token(100), 99999), true);
  assert.equal(session.tokenIsValid(token(100), 100000), false);
  for (const invalid of [null, '', 'invalid', 'a.%%.b', token(undefined), token('100')]) {
    assert.equal(session.tokenIsValid(invalid, 0), false);
  }
});

test('expires a stored session once without deleting unrelated preferences', () => {
  values.clear();
  let notifications = 0;
  session.configureSession(() => notifications++);
  localStorage.setItem('token', token(1));
  localStorage.setItem('usuario', '{}');
  localStorage.setItem('preference', 'keep');
  assert.equal(session.hasValidSession(), false);
  assert.equal(session.hasValidSession(), false);
  assert.equal(notifications, 1);
  assert.equal(localStorage.getItem('token'), null);
  assert.equal(localStorage.getItem('usuario'), null);
  assert.equal(localStorage.getItem('preference'), 'keep');
});

test('an old unauthorized response cannot terminate a newer login', () => {
  values.clear();
  const current = token(Date.now() / 1000 + 3600);
  localStorage.setItem('token', current);
  localStorage.setItem('usuario', '{}');
  session.expireSession(token(1));
  assert.equal(session.hasValidSession(), true);
  assert.equal(localStorage.getItem('token'), current);
});
