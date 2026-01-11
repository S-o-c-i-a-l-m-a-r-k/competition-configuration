# Configuration Guide

## Overview

This guide explains how to configure multi-round competitions using the interactive web interface. The system automatically calculates most values—you only need to specify a few key parameters.

**To get started:** Open `widget-demo.html` in your browser to use the interactive configuration tool.

## Minimum Configurable Variables

To configure a competition, you need to specify these **4 key parameters**:

### 1. Starting Competitors
- **Field**: "Starting Competitors" (top of sidebar)
- **Example**: 63,000
- **Description**: Total number of competitors entering the competition

### 2. Round 1 Gate Size
- **Field**: "Gate Size" in Round 1 section
- **Example**: 4
- **Description**: How many competitors advance from each Round 1 group
- **Note**: Round 1 "People/Group" is calculated automatically and displayed as read-only

### 3. Middle Rounds Configuration
For each middle round (Rounds 2 through N-1), specify:
- **People/Group**: Group size (must be **integer**, e.g., 20)
- **Gate Size**: Number advancing from each group (e.g., 2)

**Example:**
- Round 2: People/Group = 20, Gate Size = 2
- Round 3: People/Group = 20, Gate Size = 2

### 4. Final Round Configuration
- **People/Group**: Number of finalists (equals target finalists, e.g., 100)
- **Gate Size**: Number of additional prize recipients (e.g., 20)
- **Constraint**: Final round always has exactly **1 group** (enforced automatically)

## Configuration Workflow

### Recommended Approach: Work Backwards from Final Round

Start with your desired final round and work backwards to determine what each previous round needs to produce.

#### Step 1: Set Target Finalists

In the "Competition Settings" section:
- Set **Target Finalists** to your desired number (e.g., 100)

#### Step 2: Configure Final Round

In the final round configuration:
- Set **People/Group** = Target Finalists (e.g., 100)
- Set **Gate Size** = Number of additional prize recipients (e.g., 20)

**Result**: 100 finalists compete in 1 group, top 20 get prizes.

#### Step 3: Configure Middle Rounds (Working Backwards)

For each middle round, determine what it needs to produce for the next round.

**Example: Round 3 (produces 100 for final)**
- Target: 100 competitors for final round
- Set: People/Group = 20, Gate Size = 2
- Calculation: 100 ÷ 2 = 50 groups needed
- Result: 50 groups × 20 people = 1,000 competitors needed in Round 3

**Example: Round 2 (produces 1,000 for Round 3)**
- Target: 1,000 competitors for Round 3
- Set: People/Group = 20, Gate Size = 2
- Calculation: 1,000 ÷ 2 = 500 groups needed
- Result: 500 groups × 20 people = 10,000 competitors needed in Round 2

#### Step 4: Round 1 (Automatically Calculated)

Round 1 is calculated automatically based on:
- Starting competitors: 63,000
- Competitors needed for Round 2: 10,000
- Round 1 gate size: 4 (you set this)

**What happens:**
- Groups needed: 10,000 ÷ 4 = 2,500 groups (calculated)
- People per group: 63,000 ÷ 2,500 = 25.2 (calculated, displayed as read-only)

You only need to set the **Gate Size** for Round 1. The system calculates the rest.

## What Gets Calculated Automatically

### Round 1
- **Number of Groups**: Calculated to produce the right number of advancing competitors
- **People/Group**: Calculated from starting competitors ÷ numberOfGroups (can be fractional, displayed as read-only)

### Middle Rounds (2 through N-1)
- **Number of Groups**: Calculated from total competitors ÷ peoplePerGroup
- **Total Competitors**: Set from previous round's advancing count

### Final Round
- **Number of Groups**: Always 1 (enforced automatically)
- **Total Competitors**: Should equal your target finalists

## Using the Web Interface

### Step-by-Step Configuration

1. **Open the Interface**
   - Open `widget-demo.html` in your browser

2. **Set Global Settings**
   - Enter "Starting Competitors" (e.g., 63,000)
   - Enter "Target Finalists" (e.g., 100)
   - Select "Number of Rounds" (e.g., 4)
   - Set "Round Duration" (e.g., 4 days)
   - Choose "Start Date"

3. **Configure Final Round First**
   - Scroll to the final round section
   - Set People/Group = Target Finalists (e.g., 100)
   - Set Gate Size (e.g., 20)

4. **Configure Middle Rounds (Working Backwards)**
   - For each middle round, set:
     - People/Group (integer, e.g., 20)
     - Gate Size (e.g., 2)

5. **Set Round 1 Gate Size**
   - Set Gate Size for Round 1 (e.g., 4)
   - People/Group is calculated automatically

6. **Review Results**
   - Check the results table for calculated values
   - Review validation messages
   - Verify constraints are met

### Real-Time Updates

- **Automatic Calculation**: Results update as you type (300ms debounce)
- **Visual Feedback**: Validation messages appear instantly
- **Constraint Checking**: Errors and warnings shown in real-time
- **No Manual Refresh**: Changes apply automatically

## Fractional Group Sizes

### ✅ Round 1 Only

Fractional `peoplePerGroup` is **only allowed in Round 1**.

**Why?** Round 1 needs to accommodate a large starting pool with an odd number. Fractional values mean some groups have slightly different sizes.

**Example:**
- 2,500 groups with average 25.2 people/group
- Means: Some groups have 25 people, others have 26 people
- Total: 2,500 groups × 25.2 avg = 63,000 competitors ✓

**In the UI**: Round 1 "People/Group" field shows the calculated fractional value (e.g., "25.20") and is read-only.

### ❌ Other Rounds

Rounds 2+ should have **integer** `peoplePerGroup`.

**In the UI**: Enter whole numbers (e.g., 20, not 20.5). The system will warn if you enter fractional values.

## Validation Rules

The interface validates your configuration in real-time:

### Fractional peoplePerGroup
- ✅ **Valid**: Round 1 with fractional (calculated automatically)
- ⚠️ **Warning**: Round 2+ with fractional
  - Warning: "peoplePerGroup should be integer in middle rounds"

### Final Round Constraint
- ✅ **Valid**: 1 group (enforced automatically)
- ✗ **Invalid**: Multiple groups
  - Error: "Final round must have exactly 1 group"
  - **Fix**: Set final round People/Group = Target Finalists

### Gate Size Constraint
- ✅ **Valid**: Gate size ≤ people per group
- ✗ **Invalid**: Gate size > people per group
  - Error: "gateSize cannot exceed peoplePerGroup"
  - **Fix**: Reduce gate size or increase people per group

## Common Configuration Patterns

### Pattern 1: Aggressive Elimination (4 → 2 → 2)

Fast reduction from large starting pool:

**Configuration:**
- Starting: 63,000
- Round 1: Gate Size = 4 → produces 10,000
- Round 2: People/Group = 20, Gate Size = 2 → produces 1,000
- Round 3: People/Group = 20, Gate Size = 2 → produces 100
- Final: People/Group = 100, Gate Size = 20

**Result**: 63,000 → 10,000 → 1,000 → 100 finalists

### Pattern 2: Gradual Elimination (2 → 2 → 2)

Slower, more even reduction:

**Configuration:**
- Starting: 50,000
- Round 1: Gate Size = 2 → produces 10,000
- Round 2: People/Group = 20, Gate Size = 2 → produces 1,000
- Round 3: People/Group = 20, Gate Size = 2 → produces 100
- Final: People/Group = 100, Gate Size = 20

**Result**: 50,000 → 10,000 → 1,000 → 100 finalists

### Pattern 3: Mixed Gate Sizes

Varying elimination rates:

**Configuration:**
- Starting: 50,000
- Round 1: Gate Size = 5 → produces 10,000
- Round 2: People/Group = 25, Gate Size = 3 → produces 1,200
- Round 3: People/Group = 20, Gate Size = 2 → produces 120
- Final: People/Group = 120, Gate Size = 20

**Result**: 50,000 → 10,000 → 1,200 → 120 finalists

## Quick Presets

The interface includes pre-configured presets to get started quickly:

- **Nov 2025**: 63,000 → 100 finalists (4 rounds)
- **Small**: 1,000 → 50 finalists (3 rounds)
- **Medium**: 10,000 → 100 finalists (4 rounds)
- **Large**: 50,000 → 100 finalists (4 rounds)

Click a preset button to load the configuration, then adjust as needed.

## Tips for Success

### 1. Start from the End
Always configure the final round first, then work backwards. This ensures you hit your target finalists.

### 2. Use Integer Group Sizes
For middle rounds, use whole numbers for People/Group (e.g., 20, not 20.5). This ensures uniform groups.

### 3. Check Validation Messages
The interface shows validation messages at the top. Green = valid, yellow = warnings, red = errors.

### 4. Review the Results Table
The results table shows all calculated values. Verify:
- Round 1 People/Group (may be fractional)
- All middle rounds have integer People/Group
- Final round has exactly 1 group
- All advancing counts are whole numbers

### 5. Adjust and Iterate
Change values and watch results update in real-time. The interface makes it easy to experiment and find the right configuration.

## Summary

| Parameter | Location | Type | Configured? | Example |
|-----------|----------|------|-------------|---------|
| Starting competitors | Competition Settings | Integer | ✅ Yes | 63,000 |
| Target finalists | Competition Settings | Integer | ✅ Yes | 100 |
| Round 1 gate size | Round 1 section | Integer | ✅ Yes | 4 |
| Round 1 people/group | Round 1 section | Decimal | ❌ No | 25.2 (calculated, read-only) |
| Middle round people/group | Round 2-N sections | Integer | ✅ Yes | 20 |
| Middle round gate size | Round 2-N sections | Integer | ✅ Yes | 2 |
| Final round people/group | Final round section | Integer | ✅ Yes | 100 |
| Final round gate size | Final round section | Integer | ✅ Yes | 20 |

**Key Takeaway**: You configure gate sizes and middle round group sizes. The system calculates everything else automatically to ensure valid configurations.

## Next Steps

- See [WEB_INTERFACE_GUIDE.md](WEB_INTERFACE_GUIDE.md) for detailed interface instructions
- See [CONSTRAINTS_REFERENCE.md](CONSTRAINTS_REFERENCE.md) for complete constraint details
- See [README.md](../README.md#quick-start) for quick start guide

For programmatic use of the Node.js API, see the [README.md](../README.md#option-3-nodejs-api).
