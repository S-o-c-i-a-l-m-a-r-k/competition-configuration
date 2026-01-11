# Web Interface Guide

## Overview

The interactive web interface (`widget-demo.html`) provides a visual, user-friendly way to configure and validate competition structures without writing any code. It uses the embeddable widget component.

## Getting Started

### Opening the Interface

**Method 1: Command Line**
```bash
open widget-demo.html
```

**Method 2: File Explorer**
- Navigate to the project directory
- Double-click `widget-demo.html`
- It will open in your default web browser

**Method 3: Drag & Drop**
- Drag `widget-demo.html` into any web browser window

## Interface Layout

### Left Sidebar: Configuration Panel

#### Competition Settings
- **Competition Name**: Give your competition a descriptive name
- **Starting Competitors**: Total number of participants (e.g., 63,000)
- **Target Finalists**: Desired number in the final round (e.g., 100)
- **Number of Rounds**: Choose 2-5 rounds
- **Start Date**: When the competition begins

#### Round Configuration
Dynamic forms for each round:

**Round 1:**
- Gate Size: How many advance per group
- Duration: Number of days
- *Note: Number of groups is calculated automatically*

**Rounds 2+:**
- People/Group: Competitors per group (should be integer)
- Gate Size: How many advance per group
- Duration: Number of days


### Right Panel: Results & Validation

#### Validation Messages
Shows real-time feedback:
- ✅ **Success**: All constraints met
- ⚠️ **Warnings**: Non-critical issues
- ❌ **Errors**: Critical problems that must be fixed

#### Summary Cards
Key metrics at a glance:
- Starting competitors
- Final competitors
- Number of rounds
- Grand prizes (always 1)
- Additional prizes (variable)

#### Flow Diagram
Visual representation of competitor progression through rounds.

#### Results Table
Detailed breakdown of each round:
- Round number and name
- Number of groups
- People per group
- Gate size
- Total competitors
- Advancing competitors
- Date ranges

#### Constraints Validation
Checklist showing which constraints are met:
- ✅ Integer numberOfGroups
- ✅ Integer gateSize
- ✅ Integer advancing
- ✅ Final round has 1 group
- ✅ Grand prize = 1

## How to Use

### Basic Workflow

1. **Configure Competition Settings**
   - Enter starting competitors (e.g., 63,000)
   - Set target finalists (e.g., 100)
   - Choose number of rounds (2-10)
   - Set round duration and start date

2. **Configure Rounds**
   - Modify any values in the left sidebar
   - **Results update automatically as you type!** ✨
   - No need to click a button - changes reflect instantly

2. **Adjust Round Parameters**
   - Set Round 1 gate size
   - Configure middle rounds (people/group and gate size)
   - Final round is automatically synced with target finalists
   - **Results update automatically as you type!** ✨

3. **Validate Configuration**
   - Check validation messages at the top
   - Review constraints checklist at the bottom
   - Fix any errors or warnings

4. **Iterate**
   - Try different configurations
   - Test edge cases
   - See instant feedback on changes
   - Understand how changes cascade in real-time

### Testing for Logic Errors

The interface helps you test for logic errors by:

#### Real-time Validation
- Automatically validates after each calculation
- Shows specific error messages
- Highlights problematic values with badges

#### Visual Indicators
- 🟢 Green badges = OK
- 🟡 Yellow badges = Warning
- 🔴 Red badges = Error
- 🔵 Blue badges = Info

#### Common Issues to Test

**1. Final Round Not Having 1 Group**
```
Error: "Final round must have exactly 1 group, but has 5"
Fix: Adjust final round peoplePerGroup to equal finalists
```

**2. Fractional Groups in Middle Rounds**
```
Warning: "Round 2: peoplePerGroup should be integer in middle rounds"
Fix: Use integer values for peoplePerGroup in rounds 2+
```

**3. Target Finalists Mismatch**
```
Warning: "Target finalists: 100, actual: 96 (4% difference)"
Fix: Adjust gate sizes or group sizes to hit target exactly
```

**4. Non-Integer Groups**
```
Error: "Round 2: numberOfGroups must be integer"
Fix: System auto-rounds, but check recalculated values
```

## Features

### Real-Time Auto-Updates ✨
- **Instant feedback**: Results update as you type
- **300ms debounce**: Smooth performance without lag
- **Visual indicator**: See "Calculating..." when processing
- **No manual recalculation**: Changes apply automatically
- **Smart updates**: Only recalculates when values change

### Automatic Calculations
- Changes propagate through all rounds
- Dates calculated automatically
- Missing values computed
- Round 1 groups calculated from target

### Constraint Checking
- Integer enforcement
- Final round validation
- Prize structure validation
- Fractional support (Round 1 only)

### Visual Feedback
- Color-coded validation messages
- Badge indicators on table values
- Summary statistics
- Flow diagrams

### Quick Testing
- Instant validation
- Real-time calculations
- No coding required
- Session storage preserves your settings

## Understanding the Results

### Table Columns Explained

**Groups**: Number of competing groups
- Must be integer
- Final round must = 1
- Badge if final round

**People/Group**: Average competitors per group
- Can be fractional in Round 1
- Should be integer in rounds 2+
- Badge if fractional

**Gate Size**: How many advance per group
- Must be integer
- Determines advancing count

**Total**: Total competitors in this round
- Equals previous round's advancing
- Must be integer

**Advancing**: Moving to next round
- = numberOfGroups × gateSize
- Must be integer

**Dates**: Round duration
- Calculated from start date
- Sequential with no gaps

### Summary Cards Explained

**Starting**: Initial competitors entering
**Finalists**: Competitors in final round
**Rounds**: Total number of rounds
**Grand Prize**: Always 1 (constant)
**Additional Prizes**: Top N performers (= final gateSize)

### Validation Messages Explained

**✅ Success**
- All constraints met
- Configuration is valid
- Ready to use

**⚠️ Warnings**
- Non-critical issues
- Configuration may work but not optimal
- Review suggestions

**❌ Errors**
- Critical problems
- Configuration will not work correctly
- Must be fixed

## Tips & Best Practices

### Design Process

1. **Start from the End**
   - Decide final round size (e.g., 100)
   - Decide additional prizes (e.g., 20)
   - Set final round: peoplePerGroup = 100, gateSize = 20

2. **Work Backwards**
   - Round 3: What produces 100? (50 groups × 2 = 100)
   - Round 2: What produces 1,000? (500 groups × 2 = 1,000)
   - Round 1: Calculated to fit starting competitors

3. **Use Integer Group Sizes**
   - Round 1: Fractional OK (e.g., 25.2)
   - Rounds 2+: Use integers (e.g., 20)
   - Ensures fairness

4. **Verify Final Round**
   - Always check: numberOfGroups = 1
   - All finalists compete together
   - Critical requirement

### Common Patterns

**Standard 4-Round (63K → 100)**
```
Round 1: gate=4, groups≈2500
Round 2: people=20, gate=2
Round 3: people=20, gate=2
Round 4: people=100, gate=20
```

**Aggressive Reduction (50K → 100)**
```
Round 1: gate=5, groups≈2000
Round 2: people=20, gate=2
Round 3: people=20, gate=2
Round 4: people=100, gate=20
```

**Gentle Reduction (10K → 50)**
```
Round 1: gate=2, groups≈1000
Round 2: people=20, gate=2
Round 3: people=50, gate=10
```

## Troubleshooting

### Interface Not Loading
- Make sure JavaScript is enabled
- Try a different browser (Chrome, Firefox, Safari)
- Check browser console for errors (F12)

### Calculations Not Updating
- Wait 300ms for auto-calculation (debounced)
- Click "🔄 Recalculate Now" button for immediate update
- Check all required fields are filled
- Verify no browser errors in console

### Validation Shows Errors
- Read error messages carefully
- Check constraints checklist
- Adjust problematic values
- Results update automatically (or click "🔄 Recalculate Now")

### Results Look Wrong
- Verify starting competitors
- Check gate sizes
- Review round configuration
- Check that final round people/group equals target finalists

## Advanced Usage

### Testing Edge Cases

**Minimum Configuration**
- 100 competitors → 10 finalists
- 2 rounds
- Tests lower bounds

**Maximum Configuration**
- 100,000 competitors → 100 finalists
- 5 rounds
- Tests upper bounds

**Fractional Scenarios**
- Use non-round numbers
- Test auto-rounding
- Verify recalculations

**Invalid Configurations**
- Multiple final groups
- Fractional gate sizes
- Non-matching targets
- See error handling

### Understanding Constraints

The interface helps you understand constraints by:
1. Showing which are met (✅) or failed (❌)
2. Explaining why errors occur
3. Suggesting fixes
4. Providing visual feedback

### Learning the System

Use the interface to:
1. Experiment safely
2. See calculations in real-time
3. Understand relationships
4. Test edge cases
5. Build intuition

## Keyboard Shortcuts

- **Tab**: Navigate between fields
- **Enter**: (in number field) Recalculate
- **Esc**: (when focused) Blur field

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## No Installation Required

The web interface:
- ✅ Runs entirely in the browser
- ✅ No server needed
- ✅ No dependencies
- ✅ No installation
- ✅ Works offline
- ✅ Pure HTML/CSS/JavaScript

## Limitations

The web interface currently does NOT include:
- Multiple scenario comparison
- Export/import functionality

For advanced features like programmatic configuration and JSON export/import, use the Node.js API.

## Examples

### Example 1: Create Small Competition

1. Set starting competitors to 1,000
2. Set target finalists to 50
3. Set number of rounds to 3
4. Configure Round 1: gate size = 2
5. Configure Round 2: people/group = 20, gate size = 2
6. Observe: Results update automatically
7. Validate: Check for warnings

### Example 2: Test Final Round Constraint

1. Configure a competition with any settings
2. Manually change final round people/group to 20 (if editable)
3. See error: "Final round must have exactly 1 group"
4. Fix: Final round people/group is automatically synced with target finalists
5. Validate: Error cleared

### Example 3: Test Fractional Groups

1. Set starting competitors to 63,000
2. Set target finalists to 100
3. Set Round 1 gate size to 4
4. Observe Round 1: people/group = 25.2 (fractional, which is OK)
5. Change Round 2 people/group to 20.5
6. See warning: "Should be integer in middle rounds"
7. Fix: Change back to 20
8. Validate: Warning cleared

## Getting Help

- Check validation messages for specific errors
- Review constraints checklist
- See [CONSTRAINTS_REFERENCE.md](CONSTRAINTS_REFERENCE.md) for details (same directory)
- See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for workflow (same directory)
- See [README.md](../README.md) for complete documentation

## Next Steps

After using the web interface:
1. Understand the constraints
2. Design your configuration
3. Use Node.js API for programmatic access
4. Integrate widget into your web application
5. See [WIDGET_GUIDE.md](WIDGET_GUIDE.md) for embedding instructions

## Feedback

The web interface is designed to help you:
- ✅ Learn the system quickly
- ✅ Test configurations safely
- ✅ Validate before coding
- ✅ Understand constraints visually
- ✅ Build confidence

Enjoy experimenting with competition configurations!
