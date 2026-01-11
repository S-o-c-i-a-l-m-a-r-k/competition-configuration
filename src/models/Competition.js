const Round = require('./Round');
const RoundCalculator = require('../calculators/RoundCalculator');

/**
 * Represents a complete competition with multiple rounds
 */
class Competition {
  constructor({
    name = 'Competition',
    startingCompetitors = 45000,
    targetFinalists = 100,
    startDate = null,
    rounds = []
  }) {
    this.name = name;
    this.startingCompetitors = startingCompetitors;
    this.targetFinalists = targetFinalists;
    this.startDate = startDate;
    this.rounds = rounds.map(r => r instanceof Round ? r : Round.fromJSON(r));
  }

  /**
   * Add a round to the competition
   */
  addRound(roundConfig) {
    const round = roundConfig instanceof Round ? roundConfig : new Round(roundConfig);
    this.rounds.push(round);
    return round;
  }

  /**
   * Calculate all rounds based on configuration
   */
  calculateAllRounds() {
    if (this.rounds.length === 0) {
      throw new Error('No rounds configured');
    }

    // Build configuration for RoundCalculator
    const config = {
      startingCompetitors: this.startingCompetitors,
      startDate: this.startDate,
      rounds: this.rounds.map(r => ({
        name: r.name,
        numberOfGroups: r.numberOfGroups,
        peoplePerGroup: r.peoplePerGroup,
        gateSize: r.gateSize,
        duration: r.duration
      }))
    };

    // Calculate all rounds
    this.rounds = RoundCalculator.calculateAllRounds(config);

    return this.rounds;
  }

  /**
   * Recalculate from a specific round index (when a value changes)
   */
  recalculateFromRound(roundIndex) {
    if (roundIndex === 0) {
      // If round 1 changed, recalculate all
      this.rounds = RoundCalculator.recalculateFromIndex(this.rounds, 0);
    } else {
      // Recalculate from the changed round
      this.rounds = RoundCalculator.recalculateFromIndex(this.rounds, roundIndex);
    }

    return this.rounds;
  }

  /**
   * Update Round 1 number of groups and recalculate cascade
   */
  updateRound1Groups(numberOfGroups) {
    if (this.rounds.length === 0) {
      throw new Error('No rounds configured');
    }

    this.rounds[0].numberOfGroups = numberOfGroups;
    this.rounds[0].totalCompetitors = this.startingCompetitors;
    this.rounds[0].calculateMissingValue(); // Recalculate people per group

    // Cascade through remaining rounds
    return this.recalculateFromRound(0);
  }

  /**
   * Get the final number of competitors
   */
  getFinalCompetitorCount() {
    if (this.rounds.length === 0) return 0;
    const lastRound = this.rounds[this.rounds.length - 1];
    return lastRound.totalCompetitors;
  }

  /**
   * Get the number of additional prize recipients (from final round gate size)
   * All top gateSize competitors receive the additional prize
   */
  getAdditionalPrizeRecipients() {
    if (this.rounds.length === 0) return 0;
    const lastRound = this.rounds[this.rounds.length - 1];
    return lastRound.gateSize;
  }

  /**
   * Get the grand prize winner count (always 1)
   * Note: The grand prize winner ALSO receives the additional prize
   */
  getGrandPrizeWinners() {
    return this.rounds.length > 0 ? 1 : 0;
  }

  /**
   * Validate the entire competition
   */
  validate() {
    const errors = [];

    if (!this.startingCompetitors || this.startingCompetitors <= 0) {
      errors.push('startingCompetitors must be positive');
    }

    if (this.rounds.length === 0) {
      errors.push('Competition must have at least one round');
    }

    // Validate each round
    this.rounds.forEach((round, index) => {
      const validation = round.validate();
      if (!validation.valid) {
        errors.push(`Round ${index + 1} (${round.name}): ${validation.errors.join(', ')}`);
      }
    });

    // Validate round 1 has correct starting competitors
    if (this.rounds.length > 0) {
      const round1 = this.rounds[0];
      if (round1.totalCompetitors !== this.startingCompetitors) {
        errors.push(
          `Round 1 totalCompetitors (${round1.totalCompetitors}) does not match startingCompetitors (${this.startingCompetitors})`
        );
      }
    }

    // Validate cascade between rounds
    for (let i = 1; i < this.rounds.length; i++) {
      const prevRound = this.rounds[i - 1];
      const currentRound = this.rounds[i];

      const expected = prevRound.getAdvancingCompetitors();
      if (Math.abs(currentRound.totalCompetitors - expected) > 0.01) {
        errors.push(
          `Round ${i + 1} totalCompetitors (${currentRound.totalCompetitors}) does not match advancing from Round ${i} (${expected})`
        );
      }
    }

    // Validate final round has exactly 1 group
    if (this.rounds.length > 0) {
      const finalRound = this.rounds[this.rounds.length - 1];
      if (finalRound.numberOfGroups !== 1) {
        errors.push(
          `Final round must have exactly 1 group, but has ${finalRound.numberOfGroups}`
        );
      }
    }

    // Check if final competitors close to target
    const finalCount = this.getFinalCompetitorCount();
    if (this.targetFinalists && Math.abs(finalCount - this.targetFinalists) > this.targetFinalists * 0.1) {
      errors.push(
        `Final competitor count (${finalCount}) differs significantly from target (${this.targetFinalists})`
      );
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get summary statistics
   */
  getSummary() {
    return {
      name: this.name,
      startingCompetitors: this.startingCompetitors,
      targetFinalists: this.targetFinalists,
      actualFinalists: this.getFinalCompetitorCount(),
      grandPrizeWinners: this.getGrandPrizeWinners(),
      additionalPrizeRecipients: this.getAdditionalPrizeRecipients(),
      numberOfRounds: this.rounds.length,
      startDate: this.startDate,
      endDate: this.rounds.length > 0 ? this.rounds[this.rounds.length - 1].endDate : null
    };
  }

  /**
   * Export to JSON
   */
  toJSON() {
    return {
      name: this.name,
      startingCompetitors: this.startingCompetitors,
      targetFinalists: this.targetFinalists,
      startDate: this.startDate,
      rounds: this.rounds.map(r => r.toJSON()),
      summary: this.getSummary()
    };
  }

  /**
   * Create Competition from JSON
   */
  static fromJSON(obj) {
    return new Competition({
      name: obj.name,
      startingCompetitors: obj.startingCompetitors,
      targetFinalists: obj.targetFinalists,
      startDate: obj.startDate,
      rounds: obj.rounds || []
    });
  }

  /**
   * Format as table for display
   */
  toTable() {
    const rows = this.rounds.map((round, index) => ({
      Round: index + 1,
      Name: round.name,
      Groups: round.numberOfGroups?.toFixed(1),
      'People/Group': round.peoplePerGroup?.toFixed(1),
      'Gate Size': round.gateSize,
      'Total Competitors': Math.round(round.totalCompetitors),
      Advancing: round.numberOfGroups && round.gateSize ? round.getAdvancingCompetitors() : 0,
      'Start Date': round.startDate || 'N/A',
      'End Date': round.endDate || 'N/A'
    }));

    return rows;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Competition;
}
