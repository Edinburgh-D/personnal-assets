#!/usr/bin/env node

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 2) {
    const key = rest[index];
    const value = rest[index + 1];
    if (!key?.startsWith('--') || value === undefined) {
      fail(`Invalid argument near: ${key || '<end>'}`);
    }
    options[key.slice(2)] = value;
  }
  return { command, options };
}

function readPool(poolPath) {
  const resolved = path.resolve(poolPath);
  return { resolved, data: JSON.parse(fs.readFileSync(resolved, 'utf8')) };
}

function normalizeName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/知识库$/u, '')
    .replace(/[\s:：()（）/\\·,，.。\-—_《》“”"']/gu, '');
}

function randomItem(items) {
  if (!items.length) fail('No selectable topics remain.');
  return items[crypto.randomInt(items.length)];
}

function selectTopic(pool) {
  const used = new Set([
    ...(pool.used || []).map((item) => normalizeName(item.name)),
    ...(pool.skipped || []).map((item) => normalizeName(item.name)),
    ...(pool.existingLibraries || []).map(normalizeName),
  ]);

  const candidates = [];
  for (const domain of pool.domains || []) {
    for (const topic of domain.topics || []) {
      if (used.has(normalizeName(topic.name))) continue;
      const relatedTo = [...new Set([...(domain.relatedTo || []), ...(topic.relatedTo || [])])];
      candidates.push({
        name: topic.name,
        type: topic.type || 'single',
        domain: domain.name,
        colorScheme: domain.colorScheme || 'neutral',
        relatedTo,
      });
    }
  }

  if (!candidates.length) fail('The topic pool has no unused topics.');
  const relatedCandidates = candidates.filter((item) => item.relatedTo.length > 0);
  const relatedWeight = Number(pool.relatedWeight ?? 0.7);
  const useRelated = relatedCandidates.length > 0 && Math.random() < relatedWeight;
  const selected = randomItem(useRelated ? relatedCandidates : candidates);

  return {
    ...selected,
    selectionMode: useRelated ? 'related' : 'random',
    remainingBeforeRun: candidates.length,
  };
}

function completeTopic(poolPath, pool, options) {
  const required = ['topic', 'domain', 'slug', 'entry', 'generated-at'];
  for (const key of required) {
    if (!options[key]) fail(`Missing --${key}`);
  }

  const domain = (pool.domains || []).find((item) => item.name === options.domain);
  const topic = domain?.topics?.find((item) => item.name === options.topic);
  if (!topic) fail(`Topic not found in pool: ${options.domain} / ${options.topic}`);

  pool.used ||= [];
  if (!pool.used.some((item) => item.name === options.topic)) {
    pool.used.push({
      name: options.topic,
      domain: options.domain,
      generatedAt: options['generated-at'],
      slug: options.slug,
      entry: options.entry,
    });
  }
  pool.updatedAt = options['generated-at'];
  fs.writeFileSync(poolPath, `${JSON.stringify(pool, null, 2)}\n`, 'utf8');
}

const { command, options } = parseArgs(process.argv.slice(2));
if (!options.pool) fail('Missing --pool');
const { resolved, data } = readPool(options.pool);

if (command === 'select') {
  process.stdout.write(`${JSON.stringify(selectTopic(data), null, 2)}\n`);
} else if (command === 'complete') {
  completeTopic(resolved, data, options);
} else {
  fail('Usage: topic-pool.js select|complete --pool <file> [options]');
}
