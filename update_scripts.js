const fs = require('fs');

let r1 = fs.readFileSync('scripts/generate_round1.js', 'utf8');

// remove everything between PATTERN 3 and "Generate and save"
const p3Index = r1.indexOf('// ────────────────────────────────────────────────────────────────────────────\n// PATTERN 3: Doctor Name Deduplication');
const genIndex1 = r1.indexOf('// ── Generate and save');

if (p3Index !== -1 && genIndex1 !== -1) {
    r1 = r1.substring(0, p3Index) + r1.substring(genIndex1);
    // reduce top comment mentioning 5 patterns to 2 patterns
    r1 = r1.replace('5 high-quality patterns, each producing 7 questions = 35 total', '2 high-quality patterns, each producing 7 questions = 14 total');
    fs.writeFileSync('scripts/generate_round1.js', r1);
}

let r2 = fs.readFileSync('scripts/generate_round2.js', 'utf8');

const p3aIndex = r2.indexOf('// ────────────────────────────────────────────────────────────────────────────\n// PATTERN 3:');
const genIndex2 = r2.indexOf('// ── Generate and save');

if (p3aIndex !== -1 && genIndex2 !== -1) {
    r2 = r2.substring(0, p3aIndex) + r2.substring(genIndex2);
    // reduce top comment mentioning 4 patterns to 2 patterns
    r2 = r2.replace('4 high-quality error-detection patterns, ~9 questions each = 36 total', '2 high-quality error-detection patterns, ~9 questions each = 18 total');
    fs.writeFileSync('scripts/generate_round2.js', r2);
}

