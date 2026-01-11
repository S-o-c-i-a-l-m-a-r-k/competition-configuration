const Round = require('../models/Round');

/**
 * Utility class for calculating round configurations
 */
class RoundCalculator {
  /**
   * Calculate Round 1 configuration
   * @param {number} startingCompetitors - Total competitors starting
   * @param {number} numberOfGroups - Fixed number of groups for round 1
   * @param {number} gateSize - Number advancing from each group
   * @param {object} options - Additional options (name, startDate, duration)
   */
  static calculateRound1(startingCompetitors, numberOfGroups, gateSize, options = {}) {
    const round = new Round({
      name: options.name || 'Round 1',
      totalCompetitors: startingCompetitors,
      numberOfGroups: numberOfGroups,
      gateSize: gateSize,
      startDate: options.startDate || null,
      duration: options.duration || 4
    });

    // Calculate people per group
    round.calculateMissingValue();

    // Calculate end date if start date provided
    if (round.startDate) {
      round.calculateEndDate();
    }

    return round;
  }

  /**
   * Calculate next round based on previous round
   * @param {Round} previousRound - The previous round
   * @param {number} peoplePerGroup - Target people per group
   * @param {number} gateSize - Number advancing from each group
   * @param {object} options - Additional options (name, duration)
   */
  static calculateNextRound(previousRound, peoplePerGroup, gateSize, options = {}) {
    const totalCompetitors = previousRound.getAdvancingCompetitors();

    const round = new Round({
      name: options.name || `Round ${options.roundNumber || ''}`,
      totalCompetitors: totalCompetitors,
      peoplePerGroup: peoplePerGroup,
      gateSize: gateSize,
      duration: options.duration || 4
    });

    // Calculate number of groups
    round.calculateMissingValue();

    // Calculate dates based on previous round
    if (previousRound.endDate) {
      const prevEnd = new Date(previousRound.endDate);
      const nextStart = new Date(prevEnd);
      nextStart.setDate(nextStart.getDate() + 1); // Start day after previous ends
      round.startDate = nextStart.toISOString().split('T')[0];
      round.calculateEndDate();
    }

    return round;
  }

  /**
   * Calculate all rounds from configuration
   * @param {object} config - Competition configuration
   * @returns {Round[]} Array of calculated rounds
   */
  static calculateAllRounds(config) {
    const {
      startingCompetitors,
      startDate,
      rounds: roundConfigs
    } = config;

    const rounds = [];

    roundConfigs.forEach((roundConfig, index) => {
      let round;

      if (index === 0) {
        // First round - use starting competitors
        round = this.calculateRound1(
          startingCompetitors,
          roundConfig.numberOfGroups,
          roundConfig.gateSize,
          {
            name: roundConfig.name || 'Round 1',
            startDate: startDate,
            duration: roundConfig.duration
          }
        );
      } else {
        // Subsequent rounds - based on previous round
        round = this.calculateNextRound(
          rounds[index - 1],
          roundConfig.peoplePerGroup,
          roundConfig.gateSize,
          {
            name: roundConfig.name || `Round ${index + 1}`,
            roundNumber: index + 1,
            duration: roundConfig.duration
          }
        );
      }

      rounds.push(round);
    });

    return rounds;
  }

  /**
   * Recalculate rounds when a parameter changes
   * @param {Round[]} rounds - Existing rounds
   * @param {number} changedIndex - Index of the round that changed
   * @returns {Round[]} Updated rounds array
   */
  static recalculateFromIndex(rounds, changedIndex) {
    const updated = [...rounds];

    // Recalculate the changed round
    const changedRound = updated[changedIndex];
    if (changedRound.totalCompetitors) {
      changedRound.calculateMissingValue();
    }

    // Recalculate all subsequent rounds
    for (let i = changedIndex + 1; i < updated.length; i++) {
      const prevRound = updated[i - 1];
      const currentRound = updated[i];

      // Update total competitors from previous round
      currentRound.totalCompetitors = prevRound.getAdvancingCompetitors();

      // Recalculate missing value
      currentRound.calculateMissingValue();

      // Update dates
      if (prevRound.endDate) {
        const prevEnd = new Date(prevRound.endDate);
        const nextStart = new Date(prevEnd);
        nextStart.setDate(nextStart.getDate() + 1);
        currentRound.startDate = nextStart.toISOString().split('T')[0];
        currentRound.calculateEndDate();
      }
    }

    return updated;
  }

  /**
   * Calculate dates for all rounds from a start date
   * @param {Round[]} rounds - Rounds array
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @returns {Round[]} Rounds with updated dates
   */
  static calculateDatesFromStart(rounds, startDate) {
    const updated = [...rounds];
    let currentDate = new Date(startDate);

    updated.forEach(round => {
      round.startDate = currentDate.toISOString().split('T')[0];
      round.calculateEndDate();

      // Next round starts after this one ends
      currentDate = new Date(round.endDate);
      currentDate.setDate(currentDate.getDate() + 1);
    });

    return updated;
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RoundCalculator;
}
