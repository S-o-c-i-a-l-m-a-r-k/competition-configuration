# Competition Configuration Constraints Reference

Complete reference for all constraints, rules, and requirements in the competition configuration system.

## Table of Contents
1. [Overview](#overview)
2. [Integer Constraints](#integer-constraints)
3. [Fractional Support](#fractional-support)
4. [Final Round Requirement](#final-round-requirement)
5. [Prize Structure](#prize-structure)
6. [Calculation Rules](#calculation-rules)
7. [Validation](#validation)
8. [Examples](#examples)
9. [Testing](#testing)

---

## Overview

### Critical Constraints Summary

| Constraint | Rule | Enforcement |
|------------|------|-------------|
| numberOfGroups | MUST be integer | Auto-rounded |
| gateSize | MUST be integer | Required |
| gateSize ≤ peoplePerGroup | Must have enough entries to advance | Validation error |
| advancing | MUST be integer | Calculated |
| peoplePerGroup | CAN be fractional (Round 1 only) | Warning if fractional in Round 2+ |
| Final round groups | MUST equal 1 | Hard requirement |
| Grand prize winners | ALWAYS 1 | Constant |
| Additional prize recipients | Variable (= final gateSize) | Calculated |

---

## Integer Constraints

### 1. numberOfGroups (MUST BE INTEGER)

**Rule:** The number of groups in any round must be a whole number.

**Rationale:** You cannot have fractional groups (e.g., 3.8 groups is impossible).

**Implementation:**
```javascript
// Automatic rounding in Round.calculateMissingValue()
this.numberOfGroups = Math.round(this.totalCompetitors / this.peoplePerGroup);

// After rounding, recalculate peoplePerGroup to maintain accuracy
this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
```

**Examples:**
```javascript
// Input: 1000 competitors, peoplePerGroup = 21
// Calculation: 1000 / 21 = 47.619...
// Rounded: 48 groups ✓
// Recalculated: peoplePerGroup = 1000 / 48 = 20.83

// Input: 1000 competitors, peoplePerGroup = 20
// Calculation: 1000 / 20 = 50
// Result: 50 groups ✓
```

**Validation:**
```javascript
if (!Number.isInteger(this.numberOfGroups)) {
  errors.push('numberOfGroups must be a whole number');
}
```

---

### 2. gateSize (MUST BE INTEGER)

**Rule:** Gate size must be a whole number.

**Rationale:** You cannot advance fractional competitors (e.g., 2.5 people).

**Typical Values:** 2, 4, 5, 10, 20

**Examples:**
```javascript
gateSize: 4   // ✓ Valid - 4 people advance per group
gateSize: 2.5 // ✗ Invalid - cannot advance 2.5 people
```

---

### 3. gateSize ≤ peoplePerGroup (ENOUGH ENTRIES TO ADVANCE)

**Rule:** Gate size cannot exceed people per group in any round.

**Rationale:** You cannot advance more people than are available in each group. There must be enough entries to fill all gate positions.

**Formula:** `gateSize ≤ peoplePerGroup`

**Examples:**
```javascript
// Valid configurations
peoplePerGroup: 20, gateSize: 2   // ✓ Only 2 advance out of 20
peoplePerGroup: 20, gateSize: 19  // ✓ 19 advance out of 20
peoplePerGroup: 20, gateSize: 20  // ✓ All 20 advance (allowed)
peoplePerGroup: 100, gateSize: 20 // ✓ 20 advance out of 100

// Invalid configurations
peoplePerGroup: 3, gateSize: 4    // ✗ Cannot advance 4 people from groups of 3
peoplePerGroup: 20, gateSize: 21  // ✗ Cannot advance more than you have
peoplePerGroup: 10, gateSize: 15  // ✗ Not enough entries available
```

**Validation:**
```javascript
// Validated in widget UI and CompetitionValidator
if (this.gateSize > this.peoplePerGroup) {
  errors.push('gateSize cannot exceed peoplePerGroup - not enough entries available to advance');
}
```

**Note:** This constraint is enforced in the widget UI and during competition validation. The widget displays an error message if gateSize exceeds peoplePerGroup.

**Key Point:**
- Gate size can **equal** people per group (everyone advances)
- Gate size **cannot exceed** people per group (not enough entries)
- Typical competitions use gate size much smaller than people per group

---

### 4. advancing (MUST BE INTEGER)

**Rule:** The number of advancing competitors must be a whole number.

**Calculation:** `advancing = numberOfGroups × gateSize`

**Guarantee:** Since both factors are integers, the result is always an integer.

**Examples:**
```javascript
50 groups × 2 gate = 100 advancing ✓
48 groups × 4 gate = 192 advancing ✓
2500 groups × 4 gate = 10,000 advancing ✓
```

**Validation:**
```javascript
const advancing = this.getAdvancingCompetitors();
if (!Number.isInteger(advancing)) {
  errors.push('Advancing competitors must be a whole number');
}
```

---

### 4. totalCompetitors (MUST BE INTEGER)

**Rule:** The total number of competitors must be a whole number.

**Rationale:** You cannot have fractional competitors.

**Note:** This is typically guaranteed by the calculation flow (starting with an integer and advancing integers).

---

## Fractional Support

### peoplePerGroup (CAN BE FRACTIONAL - ROUND 1 ONLY)

#### Round 1: Fractional Allowed ✓

**Rule:** Round 1 can have fractional `peoplePerGroup`.

**Interpretation:** Some groups have N people, others have N+1 people.

**Example:**
```javascript
// Round 1 Configuration
{
  totalCompetitors: 63000,
  numberOfGroups: 2500,
  peoplePerGroup: 25.2  // ✓ Fractional allowed in Round 1
}

// In practice:
// - Some groups have 25 competitors
// - Other groups have 26 competitors
// - Average: 25.2 people per group
// - Total: 2500 × 25.2 = 63,000
```

**Why Allow This:**
- Round 1 needs to fit an exact starting number of competitors
- Distribution is handled by the competition platform
- Natural variation in group sizes is acceptable

---

#### Rounds 2+: Integer Preferred ⚠️

**Rule:** Rounds 2+ should have integer `peoplePerGroup` for uniform group sizes.

**Rationale:** Uniform groups ensure fairness in middle rounds.

**Warning:** System issues a warning if non-integer detected in rounds 2+.

**Example:**
```javascript
// Round 2 - Good Practice
{
  peoplePerGroup: 20,  // ✓ Integer - all groups have exactly 20
  gateSize: 2
}

// Round 2 - Warning Triggered
{
  peoplePerGroup: 20.5,  // ⚠️ Warning - fractional in middle round
  gateSize: 2
}
```

**Validation:**
```javascript
if (index > 0 && !Number.isInteger(round.peoplePerGroup)) {
  warnings.push('Only Round 1 should have fractional group sizes');
}
```

---

## Final Round Requirement

### MUST Have Exactly 1 Group

**Hard Requirement:** The final round must have `numberOfGroups = 1`.

**Rationale:**
- All finalists compete together in a single group
- Ensures fair final competition
- Determines clear grand prize winner
- Prevents multiple separate final groups with different competition levels

**Implementation:**
```javascript
// Valid Configuration
{
  name: 'Final Round',
  totalCompetitors: 100,
  numberOfGroups: 1,        // ✓ Required
  peoplePerGroup: 100,
  gateSize: 20
}

// Invalid Configuration
{
  name: 'Final Round',
  totalCompetitors: 100,
  numberOfGroups: 5,        // ✗ Invalid - must be 1
  peoplePerGroup: 20,
  gateSize: 20
}
```

---

### How to Ensure Final Round = 1 Group

#### Method 1: Set peoplePerGroup = Total Finalists
```javascript
{
  name: 'Final Round',
  peoplePerGroup: 100,  // Same as number of finalists
  gateSize: 20
}
// Result: numberOfGroups = 100 ÷ 100 = 1 ✓
```

#### Method 2: Explicitly Set numberOfGroups = 1
```javascript
{
  name: 'Final Round',
  numberOfGroups: 1,
  totalCompetitors: 100,
  gateSize: 20
}
// Result: peoplePerGroup = 100 ÷ 1 = 100
```

#### Method 3: Work Backwards
If you want 100 finalists:
1. Set final round `peoplePerGroup = 100`
2. Set previous round to advance exactly 100
3. Example: 50 groups × 2 gate = 100 advancing

---

### Validation of Final Round

**Validation in Competition.validate():**
```javascript
if (this.rounds.length > 0) {
  const finalRound = this.rounds[this.rounds.length - 1];
  if (finalRound.numberOfGroups !== 1) {
    errors.push(
      `Final round must have exactly 1 group, but has ${finalRound.numberOfGroups}`
    );
  }
}
```

**Validation in CompetitionValidator:**
```javascript
const lastRound = competition.rounds[competition.rounds.length - 1];
if (lastRound && lastRound.numberOfGroups !== 1) {
  warnings.push(
    `Final round MUST have exactly 1 group, but has ${lastRound.numberOfGroups}`
  );
}
```

**Validation Error:**
```javascript
const lastRound = competition.rounds[competition.rounds.length - 1];
if (lastRound.numberOfGroups !== 1) {
  errors.push('Final round must have exactly 1 group');
}
```

---

## Prize Structure

### Two Types of Prizes

1. **Grand Prize** - Awarded to 1 person (1st place only)
2. **Additional Prize** - Awarded to top N performers (places 1-N)

### Key Principles

✅ **1st place receives BOTH prizes:**
- Grand Prize (exclusive to 1st place)
- Additional Prize (shared with places 2-20)

✅ **All top N receive the Additional Prize:**
- Including 1st place (who also gets Grand Prize)
- Example: If N=20, then places 1-20 all get Additional Prize

❌ **NO "consolation prize":**
- This terminology is incorrect
- All top N get the same additional prize
- 1st place just gets an extra grand prize on top

---

### Visual Breakdown

```
Final Round: 100 Competitors, gateSize = 20

Place 1:     Grand Prize ✓  +  Additional Prize ✓
Place 2:                        Additional Prize ✓
Place 3:                        Additional Prize ✓
...
Place 20:                       Additional Prize ✓
Place 21:    No prize
...
Place 100:   No prize
```

**Total Prize Recipients:** 20 people (places 1-20)
- 1 person gets grand prize + additional prize (1st place)
- 19 people get additional prize only (places 2-20)

---

### Prize Structure Implementation

#### Grand Prize Winners (CONSTANT)

**Rule:** Grand prize winners is ALWAYS 1 (constant, not variable).

```javascript
getGrandPrizeWinners() {
  return 1;  // ALWAYS returns 1, never changes
}
```

**Output:**
```json
{
  "grandPrizeWinners": 1  // ✓ Constant - always 1
}
```

#### Additional Prize Recipients (VARIABLE)

**Rule:** Equals the final round's `gateSize`.

```javascript
getAdditionalPrizeRecipients() {
  return this.rounds[this.rounds.length - 1].gateSize;
}
```

**Output:**
```json
{
  "additionalPrizeRecipients": 20  // ✓ Variable - based on gateSize
}
```

---

### Prize Structure Examples

#### November 2025 (gateSize = 20)
```javascript
{
  "actualFinalists": 100,
  "grandPrizeWinners": 1,              // 1st place only
  "additionalPrizeRecipients": 20      // Places 1-20 (including 1st)
}
```

**Interpretation:**
- 100 finalists compete
- **1st place:** Gets grand prize + additional prize
- **2nd-20th place:** Get additional prize
- **21st-100th place:** No prizes

#### Alternative Competition (gateSize = 10)
```javascript
{
  "actualFinalists": 50,
  "grandPrizeWinners": 1,              // 1st place only
  "additionalPrizeRecipients": 10      // Places 1-10 (including 1st)
}
```

**Interpretation:**
- 50 finalists compete
- **1st place:** Gets grand prize + additional prize
- **2nd-10th place:** Get additional prize
- **11th-50th place:** No prizes

---

### Common Prize Structure Misconceptions

#### ❌ WRONG: "1 grand prize + 19 consolation prizes"
This incorrectly implies:
- 1 person gets grand prize
- 19 different people get consolation prizes
- Total 20 prize recipients

#### ✅ CORRECT: "1 grand prize + 20 additional prizes"
This correctly means:
- 1 person (1st place) gets grand prize
- 20 people (places 1-20) get additional prize
- 1st place gets BOTH prizes
- Total 20 people receive prizes (1st gets two types)

#### Why This Matters

1. **Counts:** The grand prize winner is not separate from additional prize recipients
2. **Benefits:** 1st place gets double benefit (grand + additional)
3. **Reporting:** "How many got prizes?" = **20 people**, not 1+19

---

## Calculation Rules

### Round 1 Calculation

```javascript
Given:
  - startingCompetitors (e.g., 63,000)
  - numberOfGroups (e.g., 2,500) [must be integer]
  - gateSize (e.g., 4) [must be integer]

Calculate:
  - peoplePerGroup = startingCompetitors / numberOfGroups
  - peoplePerGroup = 63,000 / 2,500 = 25.2 [CAN be fractional]

  - advancing = numberOfGroups × gateSize
  - advancing = 2,500 × 4 = 10,000 [MUST be integer]
```

### Round 2+ Calculation

```javascript
Given:
  - totalCompetitors = previous round advancing
  - peoplePerGroup (e.g., 20) [CAN be fractional]
  - gateSize (e.g., 2) [must be integer]

Calculate:
  - numberOfGroups = totalCompetitors / peoplePerGroup
  - numberOfGroups = 10,000 / 20 = 500 [rounded to integer if needed]

  - advancing = numberOfGroups × gateSize
  - advancing = 500 × 2 = 1,000 [MUST be integer]
```

### Cascade Flow

```
Round 1: 63,000 competitors
         ↓ (2,500 groups × 4 gate = 10,000 advancing)
Round 2: 10,000 competitors
         ↓ (500 groups × 2 gate = 1,000 advancing)
Round 3: 1,000 competitors
         ↓ (50 groups × 2 gate = 100 advancing)
Round 4: 100 competitors (1 group, final)
         ↓ (1 group × 20 gate = 20 additional prize recipients)
```

---

## Validation

### Automatic Enforcement

```javascript
// In Round.calculateMissingValue()
this.numberOfGroups = Math.round(this.totalCompetitors / this.peoplePerGroup);
this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
```

### Round Validation

```javascript
// In Round.validate()
if (!Number.isInteger(this.numberOfGroups)) {
  errors.push('numberOfGroups must be a whole number');
}

if (!Number.isInteger(this.gateSize)) {
  errors.push('gateSize must be a whole number');
}

const advancing = this.getAdvancingCompetitors();
if (!Number.isInteger(advancing)) {
  errors.push('Advancing competitors must be a whole number');
}
```

### Competition Validation

```javascript
// In Competition.validate()
const finalRound = this.rounds[this.rounds.length - 1];
if (finalRound.numberOfGroups !== 1) {
  errors.push(
    `Final round must have exactly 1 group, but has ${finalRound.numberOfGroups}`
  );
}
```

### Validator Warnings

```javascript
// In CompetitionValidator.checkCommonIssues()

// Warn about fractional peoplePerGroup in rounds 2+
if (index > 0 && !Number.isInteger(round.peoplePerGroup)) {
  warnings.push('Only Round 1 should have fractional group sizes');
}

// Warn about final round not having 1 group
if (lastRound && lastRound.numberOfGroups !== 1) {
  warnings.push(
    `Final round MUST have exactly 1 group, but has ${lastRound.numberOfGroups}`
  );
}
```

### Validation Rules

```javascript
// In CompetitionValidator

// Error for non-integer groups
if (!Number.isInteger(round.numberOfGroups)) {
  errors.push('numberOfGroups must be integer');
}

// Error for final round not having 1 group (hard requirement)
if (lastRound.numberOfGroups !== 1) {
  errors.push('Final round must have exactly 1 group');
}
```

**Note:** The final round constraint is a hard requirement that generates an error, not a warning. The competition configuration is invalid if the final round does not have exactly 1 group.

---

## Examples

### ✅ Valid Configuration (November 2025)

```javascript
{
  startingCompetitors: 63000,
  targetFinalists: 100,
  rounds: [
    {
      name: 'Round 1',
      numberOfGroups: 2500,     // ✓ Integer
      gateSize: 4,              // ✓ Integer
      peoplePerGroup: 25.2,     // ✓ Fractional OK (Round 1)
      advancing: 10000          // ✓ Integer (2500 × 4)
    },
    {
      name: 'Round 2',
      numberOfGroups: 500,      // ✓ Integer
      gateSize: 2,              // ✓ Integer
      peoplePerGroup: 20,       // ✓ Integer (uniform groups)
      advancing: 1000           // ✓ Integer (500 × 2)
    },
    {
      name: 'Round 3',
      numberOfGroups: 50,       // ✓ Integer
      gateSize: 2,              // ✓ Integer
      peoplePerGroup: 20,       // ✓ Integer (uniform groups)
      advancing: 100            // ✓ Integer (50 × 2)
    },
    {
      name: 'Round 4',
      numberOfGroups: 1,        // ✓ Final round = 1 group
      gateSize: 20,             // ✓ Integer
      peoplePerGroup: 100,      // ✓ Integer
      advancing: 20             // ✓ Integer (1 × 20)
    }
  ]
}
```

**Results:**
- All `numberOfGroups` are integers: ✓
- All `advancing` are integers: ✓
- Round 1 has fractional `peoplePerGroup`: ✓ (allowed)
- Rounds 2-4 have integer `peoplePerGroup`: ✓ (preferred)
- Final round has 1 group: ✓ (required)
- Grand prize winners: 1 ✓ (constant)
- Additional prize recipients: 20 ✓ (variable)

---

### ❌ Invalid: Fractional numberOfGroups

```javascript
// Input
{
  totalCompetitors: 1000,
  peoplePerGroup: 21
}

// Calculation
numberOfGroups = 1000 / 21 = 47.619... ✗ Not an integer

// Auto-correction
numberOfGroups = Math.round(47.619) = 48 ✓ Rounded to integer

// Recalculated
peoplePerGroup = 1000 / 48 = 20.83 ✓ Fractional allowed
```

---

### ❌ Invalid: Final Round with Multiple Groups

```javascript
{
  rounds: [
    { numberOfGroups: 50, gateSize: 2 },    // 1,000 → 100
    { numberOfGroups: 5, gateSize: 20 }     // 100 in 5 groups ✗
  ]
}

// Error Message:
"Final round must have exactly 1 group, but has 5"
```

**Fix:**
```javascript
{
  rounds: [
    { numberOfGroups: 50, gateSize: 2 },    // 1,000 → 100
    { peoplePerGroup: 100, gateSize: 20 }   // 100 in 1 group ✓
  ]
}
```

---

### ❌ Invalid: Fractional gateSize

```javascript
{
  gateSize: 2.5  // ✗ Cannot advance 2.5 people
}

// Error: gateSize must be a whole number
```

---

## Testing

### Run All Tests

```bash
# Test via interactive web interface
open widget-demo.html
```

The web interface provides real-time validation and testing of all constraints:
- Automatic rounding of `numberOfGroups`
- Validation of integer constraints
- Handling of fractional `peoplePerGroup`
- Final round constraint validation

Demonstrates:
- ✓ Valid configuration with 1 final group
- ✗ Invalid configuration with multiple final groups
- Error messages and validation reports

### Run Full Demo

```bash
npm run demo
```

Shows all constraints in action with interactive examples.

---

## Constraints Checklist

Use this checklist to validate any competition configuration:

- [ ] All `numberOfGroups` are integers
- [ ] All `gateSize` are integers
- [ ] All `advancing` counts are integers
- [ ] `peoplePerGroup` in Round 1 can be fractional
- [ ] `peoplePerGroup` in Rounds 2+ are integers (preferred)
- [ ] Final round has exactly `numberOfGroups = 1`
- [ ] `grandPrizeWinners` always returns 1 (constant)
- [ ] `additionalPrizeRecipients` equals final round `gateSize`

---

## Summary Table

| Field | Round 1 | Rounds 2+ | Final Round | Type |
|-------|---------|-----------|-------------|------|
| numberOfGroups | Integer | Integer | **Must = 1** | Integer |
| gateSize | Integer | Integer | Integer | Integer |
| advancing | Integer | Integer | Integer | Integer |
| peoplePerGroup | Can be fractional | Should be integer | Should be integer | Decimal |
| totalCompetitors | Integer | Integer | Integer | Integer |
| grandPrizeWinners | - | - | **Always 1** | Constant |
| additionalPrizeRecipients | - | - | **= gateSize** | Variable |

---

## Quick Reference

### What MUST Be Integer
- `numberOfGroups` (all rounds)
- `gateSize` (all rounds)
- `advancing` (all rounds)
- `totalCompetitors` (all rounds)

### What CAN Be Fractional
- `peoplePerGroup` in Round 1 only
- Should be integer in Rounds 2+ for fairness

### Special Requirements
- Final round: `numberOfGroups = 1` (hard requirement)
- Grand prize winners: Always 1 (constant)
- Additional prize recipients: Equals final `gateSize` (variable)

---

## Related Documentation

- **[../README.md](../README.md)** - Complete system documentation
- **[CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)** - Configuration workflow
- **[PROJECT_REFERENCE.md](PROJECT_REFERENCE.md)** - Project plan and requirements
