'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { checkBranchPolicy } = require('./check-branch-policy.cjs');

const promotion = {
  EVENT_NAME: 'pull_request',
  BASE_BRANCH: 'main',
  HEAD_BRANCH: 'development',
  HEAD_REPOSITORY: 'equipo/frontend',
  REPOSITORY: 'equipo/frontend',
};

test('acepta development -> main del mismo repositorio', () => {
  assert.doesNotThrow(() => checkBranchPolicy(promotion));
});

test('rechaza ramas de trabajo directamente hacia main', () => {
  assert.throws(() => checkBranchPolicy({ ...promotion, HEAD_BRANCH: 'feature/listado' }), /development/);
});

test('rechaza una rama development de otro repositorio hacia main', () => {
  assert.throws(() => checkBranchPolicy({ ...promotion, HEAD_REPOSITORY: 'otro/frontend' }), /mismo repositorio/);
});

test('rechaza una promocion sin identidad de repositorio', () => {
  assert.throws(() => checkBranchPolicy({ ...promotion, HEAD_REPOSITORY: '', REPOSITORY: '' }));
});

test('acepta ramas de trabajo hacia development', () => {
  assert.doesNotThrow(() => checkBranchPolicy({ ...promotion, BASE_BRANCH: 'development', HEAD_BRANCH: 'feature/listado' }));
});

test('permite sincronizar main hacia development mediante PR', () => {
  assert.doesNotThrow(() => checkBranchPolicy({ ...promotion, BASE_BRANCH: 'development', HEAD_BRANCH: 'main' }));
});

test('push y ejecucion manual no se confunden con un PR', () => {
  for (const EVENT_NAME of ['push', 'workflow_dispatch']) {
    assert.doesNotThrow(() => checkBranchPolicy({ EVENT_NAME }));
  }
});
