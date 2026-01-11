# 🏆 Competition Configuration Tool

A powerful system for designing and validating multi-round competition structures with real-time calculations and constraint validation. Available as both an **embeddable widget** for web projects and a **Node.js API** for programmatic use.

![Dark Theme UI](https://img.shields.io/badge/theme-dark-black)
![Version](https://img.shields.io/badge/version-1.0.0-green)

## Overview

Design competition configurations where:
- Thousands of competitors start in Round 1
- Each round eliminates competitors through group-based advancement
- Final round ends with ~100 finalists
- All calculations cascade automatically when parameters change

## Two Ways to Use

### 1. Embeddable Widget (CDN-Ready)

Perfect for integrating into web applications:

```html
<!-- Add to any webpage -->
<div id="competition-config"></div>
<script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@1.0.0/widget.js"></script>
<script>CompetitionConfig.init('competition-config');</script>
```

**Widget Features:**
- 🎨 Complete dark theme UI
- 📊 Real-time validation and calculations
- 💾 Session storage (preserves settings)
- 🚀 Single file, zero dependencies
- ⚡ Lightweight (~35KB)
- 🔧 3 lines of code to embed

See [DEPLOYMENT.md](DEPLOYMENT.md) for widget deployment details.

### 2. Node.js API

Perfect for programmatic configuration:

```javascript
const { Competition } = require('./src/index');

const comp = new Competition({
  name: 'November 2025 Competition',
  startingCompetitors: 63000,
  targetFinalists: 100,
  rounds: [/*...*/]
});

comp.calculateAllRounds();
console.table(comp.toTable());
```

## Features

- **Automatic Calculations**: Change Round 1 groups and see all rounds recalculate
- **Integer Constraints**: Enforces whole numbers for groups and advancing competitors
- **Fractional Support**: Handles fractional people per group (e.g., 25.2 people per group)
- **Date Management**: Automatically calculates round dates based on duration
- **Validation**: Comprehensive validation with error reporting
- **Import/Export**: JSON serialization for saving configurations

## Important Constraints

⚠️ **Integer Requirements:**
- `numberOfGroups` **must** be a whole number (automatically rounded)
- `gateSize` **must** be a whole number
- `advancing` **must** be a whole number (numberOfGroups × gateSize)
- `peoplePerGroup` **can** be fractional in Round 1 only (e.g., 25.2)
- `peoplePerGroup` **should** be integer in middle rounds (uniform groups)

⚠️ **Final Round Requirement:**
- Final round **must** have exactly `numberOfGroups = 1`
- All finalists compete together in a single group

📖 See [docs/CONSTRAINTS_REFERENCE.md](docs/CONSTRAINTS_REFERENCE.md) for detailed explanation.

## Installation

```bash
# Clone or copy the project
cd competition-configuration

# No dependencies required - pure JavaScript
```

## Quick Start

### Option 1: Embeddable Widget (For Web Projects)

Embed the competition configuration tool in any webpage:

```html
<!DOCTYPE html>
<html>
<body>
    <div id="competition-config"></div>
    <script src="widget.js"></script>
    <script>CompetitionConfig.init('competition-config');</script>
</body>
</html>
```

Or use via CDN (once deployed to GitHub):
```html
<script src="https://cdn.jsdelivr.net/gh/username/competition-configuration@1.0.0/widget.js"></script>
```

**Test locally:**
```bash
open widget-demo.html
# or
python3 -m http.server 8000  # Then visit http://localhost:8000/widget-demo.html
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for CDN deployment instructions.

### Option 2: Standalone Demo

For a standalone demo of the widget, open `widget-demo.html`:

```bash
open widget-demo.html
# or double-click widget-demo.html in your file explorer
```

**Features:**
- 🎨 Visual interface with real-time updates
- 📊 Interactive configuration with instant validation
- 📈 Flow diagrams and summary cards
- ✅ Constraint checking with visual feedback
- 💾 Session storage (preserves settings)

### Option 3: Node.js API

```javascript
const { Competition } = require('./src/index');

// Create a competition
const competition = new Competition({
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

// Calculate all rounds
competition.calculateAllRounds();

// View results
console.table(competition.toTable());
console.log(competition.getSummary());
```

## Core Concepts

### Round Configuration

Each round has these key parameters:

- **totalCompetitors**: Number of competitors in this round
- **numberOfGroups**: How many groups compete
- **peoplePerGroup**: Competitors per group (can be fractional)
- **gateSize**: How many advance from each group
- **duration**: Number of days for the round
- **startDate/endDate**: Date range

### Calculation Flow

**Round 1:**
```
totalCompetitors = startingCompetitors (e.g., 63,000)
numberOfGroups = fixed (e.g., 2,500)
gateSize = fixed (e.g., 4)

→ peoplePerGroup = totalCompetitors / numberOfGroups
→ peoplePerGroup = 63,000 / 2,500 = 25.2

→ advancing = numberOfGroups × gateSize
→ advancing = 2,500 × 4 = 10,000
```

**Round 2+:**
```
totalCompetitors = previous round advancing (e.g., 10,000)
peoplePerGroup = fixed (e.g., 20)
gateSize = fixed (e.g., 2)

→ numberOfGroups = totalCompetitors / peoplePerGroup
→ numberOfGroups = 10,000 / 20 = 500

→ advancing = numberOfGroups × gateSize
→ advancing = 500 × 2 = 1,000
```

## Usage Examples

### Example 1: Create Competition

```javascript
const { Competition } = require('./src/index');

const comp = new Competition({
  name: 'My Competition',
  startingCompetitors: 45000,
  targetFinalists: 100,
  startDate: '2026-01-01',
  rounds: [
    { name: 'Round 1', numberOfGroups: 2000, gateSize: 4, duration: 4 },
    { name: 'Round 2', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 3', peoplePerGroup: 20, gateSize: 2, duration: 4 },
    { name: 'Round 4', peoplePerGroup: 20, gateSize: 20, duration: 4 }
  ]
});

comp.calculateAllRounds();
console.table(comp.toTable());
```

### Example 2: Adjust Round 1 Groups (Cascade)

```javascript
// Change Round 1 groups from 2500 to 3000
// This automatically recalculates all subsequent rounds
comp.updateRound1Groups(3000);

console.table(comp.toTable());
```

### Example 3: Validation

```javascript
const { CompetitionValidator } = require('./src/index');

const report = CompetitionValidator.generateReport(comp);

console.log(`Valid: ${report.valid}`);
console.log(`Errors: ${report.errors.length}`);
console.log(`Target Check: ${report.targetCheck.message}`);
```

### Example 4: Export/Import JSON

```javascript
// Export
const json = JSON.stringify(comp.toJSON(), null, 2);
require('fs').writeFileSync('my-competition.json', json);

// Import
const data = JSON.parse(require('fs').readFileSync('my-competition.json'));
const imported = Competition.fromJSON(data);
```

## Project Structure

```
competition-configuration/
├── widget.js                      # 🌐 Embeddable widget (CDN-ready)
├── widget-demo.html               # Standalone widget demo
├── README.md                      # This file
├── DEPLOYMENT.md                  # Widget deployment guide
├── src/                           # Node.js API
│   ├── models/
│   │   ├── Round.js              # Round model
│   │   └── Competition.js        # Competition model
│   ├── calculators/
│   │   └── RoundCalculator.js    # Round calculation logic
│   ├── validators/
│   │   └── CompetitionValidator.js # Validation logic
│   └── index.js                   # Main entry point
├── demo.js                       # Comprehensive demo script
├── README.md                      # This file
├── DEPLOYMENT.md                  # Deployment guide
└── docs/                          # Documentation
    ├── CONFIGURATION_GUIDE.md     # Configuration workflow
    ├── CONSTRAINTS_REFERENCE.md   # Complete constraints reference
    ├── WEB_INTERFACE_GUIDE.md     # Web interface guide
    ├── WIDGET_GUIDE.md            # Widget usage guide
    └── PROJECT_REFERENCE.md       # Project plan & requirements
```

## API Reference

### Competition Class

```javascript
const comp = new Competition({
  name: string,
  startingCompetitors: number,
  targetFinalists: number,
  startDate: string (YYYY-MM-DD),
  rounds: Array<RoundConfig>
});

comp.calculateAllRounds()        // Calculate all rounds
comp.updateRound1Groups(number)  // Update and cascade
comp.validate()                  // Validate configuration
comp.getSummary()                // Get summary stats
comp.toTable()                   // Format as table
comp.toJSON()                    // Export to JSON
Competition.fromJSON(obj)        // Import from JSON
```

### Round Class

```javascript
const round = new Round({
  name: string,
  totalCompetitors: number,
  numberOfGroups: number,
  gateSize: number,
  peoplePerGroup: number,
  startDate: string,
  endDate: string,
  duration: number
});

round.calculateMissingValue()    // Calculate numberOfGroups or peoplePerGroup
round.getAdvancingCompetitors()  // Get number advancing
round.calculateEndDate()         // Calculate end date
round.validate()                 // Validate round
round.toJSON()                   // Export to JSON
```

### CompetitionValidator Class

```javascript
CompetitionValidator.validateConfig(config)
CompetitionValidator.checkTargetFinalists(competition, tolerance)
CompetitionValidator.validateRoundConsistency(rounds)
CompetitionValidator.generateReport(competition)
```

## Running Examples

```bash
# Run comprehensive demo
node demo.js
```

## Testing

Testing is done interactively via the web interface (`widget-demo.html`). The November 2025 example validates correctly:

```
✓ Starting competitors = 63,000
✓ Has 4 rounds
✓ Round 1 - 2500 groups, 25.2 people/group, gate size 4
✓ Round 1 advances 10,000 competitors
✓ Round 2 - 500 groups, 20 people/group, gate size 2
✓ Round 2 advances 1,000 competitors
✓ Round 3 - 50 groups, 20 people/group, gate size 2
✓ Round 3 advances 100 competitors
✓ Round 4 - 1 group, 100 people/group, gate size 20
✓ Final round has 20 winners
✓ Starts on November 4, 2025
✓ Rounds progress correctly (4 days each)
✓ Configuration validates successfully
```

## November 2025 Competition Example

| Round | Groups | People/Group | Gate Size | Total Competitors | Advancing | Start Date | End Date |
|-------|--------|--------------|-----------|-------------------|-----------|------------|----------|
| 1 | 2,500 | 25.2 | 4 | 63,000 | 10,000 | Nov 4 | Nov 7 |
| 2 | 500 | 20 | 2 | 10,000 | 1,000 | Nov 8 | Nov 11 |
| 3 | 50 | 20 | 2 | 1,000 | 100 | Nov 12 | Nov 15 |
| 4 | 1 | 100 | 20 | 100 | 20* | Nov 16 | Nov 19 |

**Prize Structure:**
- 100 finalists compete in Round 4
- Top 20 performers receive additional prize (gate size = 20)
- 1 grand prize winner (1st place - also receives additional prize)
- Total: 1 grand prize + 20 additional prizes (including to 1st place)

## Default Values

- **Starting Competitors**: 45,000
- **Target Finalists**: 100
- **Number of Rounds**: 4
- **Round Duration**: 4 days
- **Default Gate Sizes**: [4, 2, 2, 20]
- **Default Group Sizes**: [calculated, 20, 20, 20]

## License

Open source - use freely for competition configuration needs.

## Support

For issues or questions:
1. Run `node demo.js` to see comprehensive examples
2. Use `widget-demo.html` for interactive testing
3. See detailed project documentation in `docs/PROJECT_REFERENCE.md`
4. See complete constraints reference in `docs/CONSTRAINTS_REFERENCE.md`
