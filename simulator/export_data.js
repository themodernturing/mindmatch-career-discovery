/**
 * CareerLens Data Exporter (v3)
 * 
 * Reads TypeScript source files and extracts data arrays by finding
 * the `= [` after variable declarations, then bracket-matching to the end.
 * 
 * Usage: node simulator/export_data.js
 * Run from the career-discovery root directory.
 */

const fs = require('fs');
const path = require('path');

const LIB_DIR = path.join(__dirname, '..', 'lib');
const OUT_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

/**
 * Find an array literal assigned to a variable name.
 * Looks for `varName` → then `=` → then `[` and bracket-matches to `]`.
 */
function extractArray(source, varName) {
  const varIdx = source.indexOf(varName);
  if (varIdx === -1) {
    console.error(`  ✗ Could not find "${varName}" in source`);
    return [];
  }

  // Find the `=` sign AFTER the variable name
  const eqIdx = source.indexOf('=', varIdx + varName.length);
  if (eqIdx === -1) {
    console.error(`  ✗ Could not find "=" after "${varName}"`);
    return [];
  }

  // Find the opening `[` AFTER the `=`
  const bracketStart = source.indexOf('[', eqIdx);
  if (bracketStart === -1) {
    console.error(`  ✗ Could not find "[" after "=" for "${varName}"`);
    return [];
  }

  // Bracket-match to find the closing `]`
  let depth = 0;
  let bracketEnd = bracketStart;
  for (let i = bracketStart; i < source.length; i++) {
    if (source[i] === '[') depth++;
    if (source[i] === ']') {
      depth--;
      if (depth === 0) { bracketEnd = i; break; }
    }
  }

  const arrayStr = source.substring(bracketStart, bracketEnd + 1);

  try {
    const fn = new Function(`return ${arrayStr}`);
    const result = fn();
    return result;
  } catch (e) {
    console.error(`  ✗ Eval error for "${varName}":`, e.message);
    return [];
  }
}

// ── 1. Export Questions ─────────────────────────────────────────────────────
console.log('Exporting questions...');

const questionsRaw = fs.readFileSync(path.join(LIB_DIR, 'questions.ts'), 'utf-8');

const coreQuestions = extractArray(questionsRaw, 'coreQuestions');
const branchQuestions = extractArray(questionsRaw, 'branchQuestions');
const clarifierQuestions = extractArray(questionsRaw, 'clarifierQuestions');

console.log(`  Core: ${coreQuestions.length}, Branch: ${branchQuestions.length}, Clarifier: ${clarifierQuestions.length}`);

const allQuestions = [...coreQuestions, ...branchQuestions, ...clarifierQuestions];

const questionsOut = allQuestions.map(q => ({
  id: q.id,
  section: q.section,
  category: q.category,
  text: q.text,
  dimensions: q.dimensions,
  reverse_scored: q.reverse_scored,
  active: q.active,
  tags: q.tags,
  discriminatesBetween: q.discriminatesBetween || null,
}));

fs.writeFileSync(
  path.join(OUT_DIR, 'questions.json'),
  JSON.stringify(questionsOut, null, 2)
);
console.log(`  ✓ ${questionsOut.length} questions exported`);

// ── 2. Export O*NET Questions ───────────────────────────────────────────────
console.log('Exporting O*NET questions...');

const onetRaw = fs.readFileSync(path.join(LIB_DIR, 'onet_questions.ts'), 'utf-8');
const onetQuestions = extractArray(onetRaw, 'onetQuestions');

const onetOut = onetQuestions.map(q => ({
  id: q.id,
  dimension: q.dimension,
  text: q.text,
}));

fs.writeFileSync(
  path.join(OUT_DIR, 'onet_questions.json'),
  JSON.stringify(onetOut, null, 2)
);
console.log(`  ✓ ${onetOut.length} O*NET questions exported`);

// ── 3. Export Careers ───────────────────────────────────────────────────────
console.log('Exporting careers...');

const careersRaw = fs.readFileSync(path.join(LIB_DIR, 'careers.ts'), 'utf-8');
const careersArray = extractArray(careersRaw, 'careers:');

const careersOut = careersArray.map(c => ({
  id: c.id,
  name: c.name,
  category: c.category,
  riasec_profile: c.riasec_profile,
}));

fs.writeFileSync(
  path.join(OUT_DIR, 'careers.json'),
  JSON.stringify(careersOut, null, 2)
);
console.log(`  ✓ ${careersOut.length} careers exported`);

console.log(`\n✅ All data exported to ${OUT_DIR}`);
