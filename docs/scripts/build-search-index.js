#!/usr/bin/env node
// Generates docs/search-index.json from all HTML pages in docs/
// Usage: node docs/scripts/build-search-index.js

const fs   = require('fs');
const path = require('path');

const DOCS_DIR  = path.resolve(__dirname, '..');
const OUT_FILE  = path.join(DOCS_DIR, 'search-index.json');
const SKIP_DIRS = new Set(['assets', 'scripts']);

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTitle(html) {
  const m = html.match(/<title>(.*?)<\/title>/i);
  return m ? m[1].replace(/\s*—\s*Claude Code Docs.*$/i, '').trim() : '';
}

function extractContent(html) {
  const m = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  return m ? stripHtml(m[1]) : '';
}

function walk(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && !SKIP_DIRS.has(entry.name)) {
      walk(path.join(dir, entry.name), results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(path.join(dir, entry.name));
    }
  }
  return results;
}

const pages = walk(DOCS_DIR)
  .map(file => ({
    title:   extractTitle(fs.readFileSync(file, 'utf8')),
    url:     path.relative(DOCS_DIR, file).replace(/\\/g, '/'),
    content: extractContent(fs.readFileSync(file, 'utf8')).slice(0, 6000)
  }))
  .filter(p => p.title && p.content);

fs.writeFileSync(OUT_FILE, JSON.stringify(pages));
console.log(`✓ Built search index: ${pages.length} pages → search-index.json`);
