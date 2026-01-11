/**
 * Interactive Demo of Competition Configuration System
 */

const {
  Competition,
  CompetitionValidator
} = require('./src/index');

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   COMPETITION CONFIGURATION SYSTEM - DEMO              ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

// ==========================================
// DEMO 1: November 2025 Competition
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DEMO 1: November 2025 Competition (Real Example)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const nov2025 = new Competition({
  name: 'November 2025 Competition',
  startingCompetitors: 63000,
  targetFinalists: 100,
  startDate: '2025-11-04',
  rounds: [
    { name: 'Round 1', numberOfGroups: 2500, gateSize: 4, duration: 4 },
    { name: 'Round 2', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 3', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 4', peoplePerGroup: 100, gateSize: 20, duration: 4 }
  ]
});

nov2025.calculateAllRounds();

console.log('📊 Configuration Summary:');
const summary = nov2025.getSummary();
console.log(`   • Name: ${summary.name}`);
console.log(`   • Starting Competitors: ${summary.startingCompetitors.toLocaleString()}`);
console.log(`   • Final Competitors: ${summary.actualFinalists}`);
console.log(`   • Grand Prize Winners: ${summary.grandPrizeWinners} (always 1)`);
console.log(`   • Additional Prize Recipients: ${summary.additionalPrizeRecipients}`);
console.log(`   • Rounds: ${summary.numberOfRounds}`);
console.log(`   • Duration: ${summary.startDate} to ${summary.endDate}`);

console.log('\n📋 Round-by-Round Breakdown:\n');
console.table(nov2025.toTable());

const validation = nov2025.validate();
console.log(`✅ Validation: ${validation.valid ? 'PASSED' : 'FAILED'}`);

// ==========================================
// DEMO 2: Key Constraints
// ==========================================
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DEMO 2: Key Constraints Demonstration');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✅ Constraint 1: Integer numberOfGroups\n');
console.log('   All rounds have whole number of groups:');
nov2025.rounds.forEach((r, i) => {
  console.log(`   Round ${i + 1}: ${r.numberOfGroups} groups ${Number.isInteger(r.numberOfGroups) ? '✓' : '✗'}`);
});

console.log('\n✅ Constraint 2: Fractional peoplePerGroup (Round 1 Only)\n');
console.log('   Round 1: peoplePerGroup = 25.2 (fractional OK - some groups 25, some 26)');
console.log('   Round 2: peoplePerGroup = 20 (integer - uniform groups)');
console.log('   Round 3: peoplePerGroup = 20 (integer - uniform groups)');
console.log('   Round 4: peoplePerGroup = 100 (integer - uniform groups)');

console.log('\n✅ Constraint 3: Final Round Has 1 Group\n');
const finalRound = nov2025.rounds[nov2025.rounds.length - 1];
console.log(`   Final round groups: ${finalRound.numberOfGroups} ${finalRound.numberOfGroups === 1 ? '✓' : '✗'}`);
console.log('   All finalists compete together in a single group');

console.log('\n✅ Constraint 4: Grand Prize Winner is Constant\n');
console.log(`   Grand prize winners: ${nov2025.getGrandPrizeWinners()} (always 1)`);
console.log(`   Additional prize recipients: ${nov2025.getAdditionalPrizeRecipients()} (top 20)`);
console.log('   1st place gets BOTH grand prize AND additional prize\n');

// ==========================================
// DEMO 3: Validation Report
// ==========================================
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DEMO 4: Comprehensive Validation Report');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const testComp = new Competition({
  name: 'Validation Test',
  startingCompetitors: 50000,
  targetFinalists: 100,
  rounds: [
    { name: 'Round 1', numberOfGroups: 2000, gateSize: 5, duration: 4 },
    { name: 'Round 2', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 3', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 4', peoplePerGroup: 20, gateSize: 20, duration: 4 }
  ]
});

testComp.calculateAllRounds();

const report = CompetitionValidator.generateReport(testComp);

console.log('📝 Validation Report:\n');
console.log(`   Status: ${report.valid ? '✅ VALID' : '❌ INVALID'}`);
console.log(`   Errors: ${report.errors.length}`);
console.log(`   Warnings: ${report.warnings.length}`);
console.log(`   Suggestions: ${report.suggestions.length}`);

if (report.errors.length > 0) {
  console.log('\n❌ Errors:');
  report.errors.forEach(err => console.log(`   • ${err}`));
}

if (report.warnings.length > 0) {
  console.log('\n⚠️  Warnings:');
  report.warnings.forEach(warn => console.log(`   • ${warn}`));
}

if (report.suggestions.length > 0) {
  console.log('\n💡 Suggestions:');
  report.suggestions.forEach(sug => console.log(`   • ${sug}`));
}

console.log('\n🎯 Target Check:');
console.log(`   ${report.targetCheck.message}`);

console.log('\n📊 Summary:');
console.log(JSON.stringify(report.summary, null, 2));

// ==========================================
// DEMO 4: JSON Export/Import
// ==========================================
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DEMO 5: JSON Export/Import');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📤 Exporting configuration to JSON...\n');
const jsonData = nov2025.toJSON();
const jsonString = JSON.stringify(jsonData, null, 2);

console.log('JSON Preview (first 800 characters):');
console.log(jsonString.substring(0, 800) + '...\n');

console.log('📥 Importing from JSON...\n');
const imported = Competition.fromJSON(jsonData);

console.log('✅ Import successful!');
console.log(`   Name: ${imported.name}`);
console.log(`   Rounds: ${imported.rounds.length}`);
console.log(`   Starting Competitors: ${imported.startingCompetitors.toLocaleString()}`);

// ==========================================
// DEMO 5: Configuration Workflow
// ==========================================
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('DEMO 6: Minimum Configurable Variables');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('To configure a competition, you need just 4 parameters:\n');
console.log('1️⃣  Starting Competitors: 63,000');
console.log('2️⃣  Round 1 Gate Size: 4');
console.log('3️⃣  Middle Rounds Config:');
console.log('    • Round 2: peoplePerGroup=20, gateSize=2');
console.log('    • Round 3: peoplePerGroup=20, gateSize=2');
console.log('4️⃣  Final Round Size: 100 finalists (via peoplePerGroup=100)');

console.log('\n💡 Everything else is calculated automatically:');
console.log('   • Round 1 numberOfGroups (2,500)');
console.log('   • Round 1 peoplePerGroup (25.2)');
console.log('   • All middle round numberOfGroups');
console.log('   • All totalCompetitors for each round');

console.log('\n📋 Recommended Workflow: Work Backwards from Final\n');
console.log('   Step 1: Define final round (100 finalists, top 20 prizes)');
console.log('   Step 2: Define Round 3 (needs to produce 100)');
console.log('   Step 3: Define Round 2 (needs to produce 1,000)');
console.log('   Step 4: Round 1 is calculated (fits 63,000 starting)');

console.log('\n📖 See docs/CONFIGURATION_GUIDE.md for detailed workflow\n');

// ==========================================
// END
// ==========================================
console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║   DEMO COMPLETE                                        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

console.log('📚 Documentation:');
console.log('   • README.md - Complete system documentation');
console.log('   • README.md - Complete documentation (includes Quick Start)');
console.log('   • docs/CONFIGURATION_GUIDE.md - Configuration workflow');
console.log('   • docs/CONSTRAINTS_REFERENCE.md - Complete constraints reference');
console.log('   • docs/PROJECT_REFERENCE.md - Project plan & requirements\n');

console.log('🧪 Testing:');
console.log('   • open widget-demo.html - Interactive testing via web interface\n');
