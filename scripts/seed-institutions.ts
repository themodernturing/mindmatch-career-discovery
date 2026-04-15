/**
 * Run this once to seed institutions into the database.
 * Usage: npx ts-node scripts/seed-institutions.ts
 *
 * Or just run this SQL directly in the Supabase SQL Editor:
 *
 * INSERT INTO institutions (name, code) VALUES
 *   ('The City School', 'CITYSCHOOL2026'),
 *   ('Beaconhouse School System', 'BEACONHOUSE2026'),
 *   ('Lahore Grammar School', 'LGS2026')
 * ON CONFLICT (code) DO NOTHING;
 */

const institutions = [
  { name: 'The City School', code: 'CITYSCHOOL2026' },
  { name: 'Beaconhouse School System', code: 'BEACONHOUSE2026' },
  { name: 'Lahore Grammar School', code: 'LGS2026' },
  { name: 'Demo School', code: 'DEMO2026' },
]

console.log('Run this SQL in your Supabase SQL Editor:')
console.log('')
console.log('INSERT INTO institutions (name, code) VALUES')
institutions.forEach((inst, i) => {
  const comma = i < institutions.length - 1 ? ',' : ''
  console.log(`  ('${inst.name}', '${inst.code}')${comma}`)
})
console.log('ON CONFLICT (code) DO NOTHING;')
console.log('')
console.log('Admin codes will be:')
institutions.forEach(inst => {
  console.log(`  ${inst.name}: ADMIN-${inst.code.replace('2026', '').replace('2026', '')}`)
})
