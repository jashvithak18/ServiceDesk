import { execSync } from 'child_process';

console.log('===================================================================');
console.log('              SERVICEDESK PRO - MASTER VERIFICATION TEST SUITE');
console.log('===================================================================\n');

const testFiles = [
  'src/utils/testSlaEngine.js',
  'src/utils/testAssets.js',
  'src/utils/testAiService.js',
  'src/utils/testKbSearch.js',
  'src/utils/testAnalytics.js',
  'src/utils/testNotifications.js',
];

let totalPassed = 0;

for (const file of testFiles) {
  console.log(`[MASTER TEST] Running ${file}...`);
  try {
    const output = execSync(`node ${file}`, { encoding: 'utf-8' });
    console.log(output);
    totalPassed++;
  } catch (err) {
    console.error(`[MASTER TEST FAILED] ${file}:`, err.stdout || err.message);
    process.exit(1);
  }
}

console.log('===================================================================');
console.log(`  ALL ${totalPassed}/${testFiles.length} SYSTEM SUITES PASSED CLEANLY & VERIFIED!`);
console.log('===================================================================');
