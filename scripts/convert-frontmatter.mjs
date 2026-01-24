#!/usr/bin/env node
/**
 * Convert TOML (+++) frontmatter to YAML (---) frontmatter.
 * Passes through files that already use YAML frontmatter.
 * Skips empty files.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const SRC_DIR = 'content/archive';
const OUT_DIR = 'src/content/archives';

if (!existsSync(OUT_DIR)) {
  mkdirSync(OUT_DIR, { recursive: true });
}

function parseTomlValue(value) {
  value = value.trim();

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Array (simple single-line arrays)
  if (value.startsWith('[') && value.endsWith(']')) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    // Split by comma, handling quoted strings
    const items = [];
    let current = '';
    let inQuote = false;
    let quoteChar = '';
    for (let i = 0; i < inner.length; i++) {
      const ch = inner[i];
      if (!inQuote && (ch === '"' || ch === "'")) {
        inQuote = true;
        quoteChar = ch;
        current += ch;
      } else if (inQuote && ch === quoteChar) {
        inQuote = false;
        current += ch;
      } else if (!inQuote && ch === ',') {
        items.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) items.push(current.trim());
    return items.map(item => {
      // Remove surrounding quotes
      if ((item.startsWith('"') && item.endsWith('"')) ||
          (item.startsWith("'") && item.endsWith("'"))) {
        return item.slice(1, -1);
      }
      return item;
    });
  }

  // String (quoted)
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }

  // Date (ISO format)
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }

  // Number
  if (!isNaN(value) && value !== '') {
    return Number(value);
  }

  return value;
}

function toYamlValue(value) {
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    const items = value.map(v => `"${v}"`).join(', ');
    return `[${items}]`;
  }
  // Date-like strings don't need quotes
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value;
  }
  // Quote strings
  if (typeof value === 'string') {
    if (value === '') return '""';
    // Use double quotes if contains special chars
    if (value.includes(':') || value.includes('#') || value.includes("'") ||
        value.includes('"') || value.includes('\n') || value.startsWith(' ')) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return `"${value}"`;
  }
  return String(value);
}

function convertTomlToYaml(tomlBlock) {
  const lines = tomlBlock.split('\n');
  const fields = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '+++') continue;

    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    const rawValue = trimmed.slice(eqIdx + 1);
    fields[key] = parseTomlValue(rawValue);
  }

  // Build YAML output in preferred order, skipping 'author'
  const order = ['title', 'date', 'description', 'categories', 'tags', 'slug', 'draft'];
  const yamlLines = [];

  for (const key of order) {
    if (key in fields) {
      yamlLines.push(`${key}: ${toYamlValue(fields[key])}`);
    }
  }

  // Any remaining fields (except author)
  for (const key of Object.keys(fields)) {
    if (!order.includes(key) && key !== 'author') {
      yamlLines.push(`${key}: ${toYamlValue(fields[key])}`);
    }
  }

  return yamlLines.join('\n');
}

function processFile(filepath) {
  const content = readFileSync(filepath, 'utf-8');
  if (!content.trim()) return null; // Skip empty files

  // Check if TOML frontmatter
  if (content.startsWith('+++')) {
    const endIdx = content.indexOf('+++', 3);
    if (endIdx === -1) return null;

    const tomlBlock = content.slice(3, endIdx);
    const body = content.slice(endIdx + 3);
    const yaml = convertTomlToYaml(tomlBlock);

    return `---\n${yaml}\n---${body}`;
  }

  // Already YAML frontmatter - pass through but remove author field if present
  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx === -1) return content;

    const yamlBlock = content.slice(3, endIdx);
    const body = content.slice(endIdx + 3);
    const filteredLines = yamlBlock.split('\n')
      .filter(line => !line.trim().startsWith('author:'));

    return `---${filteredLines.join('\n')}---${body}`;
  }

  return content;
}

// Process all files
const files = readdirSync(SRC_DIR).filter(f => f.endsWith('.md'));
let converted = 0;
let skipped = 0;

for (const file of files) {
  const filepath = join(SRC_DIR, file);
  const result = processFile(filepath);

  if (result === null) {
    skipped++;
    console.log(`SKIP: ${file} (empty)`);
    continue;
  }

  writeFileSync(join(OUT_DIR, file), result);
  converted++;
  console.log(`OK:   ${file}`);
}

console.log(`\nDone: ${converted} converted, ${skipped} skipped`);
