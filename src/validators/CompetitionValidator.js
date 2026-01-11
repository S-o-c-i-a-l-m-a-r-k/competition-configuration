/**
 * Validator for competition configurations
 */
class CompetitionValidator {
  /**
   * Validate a competition configuration before calculation
   * @param {object} config - Competition configuration
   */
  static validateConfig(config) {
    const errors = [];
    const warnings = [];

    // Check required fields
    if (!config.startingCompetitors || config.startingCompetitors <= 0) {
      errors.push('startingCompetitors must be a positive number');
    }

    if (!config.rounds || config.rounds.length === 0) {
      errors.push('At least one round must be configured');
    }

    // Validate each round configuration
    config.rounds?.forEach((round, index) => {
      const roundNum = index + 1;

      if (!round.gateSize || round.gateSize <= 0) {
        errors.push(`Round ${roundNum}: gateSize must be positive`);
      }

      if (index === 0) {
        // Round 1 validations
        if (!round.numberOfGroups && !round.peoplePerGroup) {
          errors.push(`Round ${roundNum}: must specify either numberOfGroups or peoplePerGroup`);
        }
        if (round.numberOfGroups && round.numberOfGroups <= 0) {
          errors.push(`Round ${roundNum}: numberOfGroups must be positive`);
        }
      } else {
        // Subsequent rounds typically have peoplePerGroup set
        if (!round.peoplePerGroup && !round.numberOfGroups) {
          warnings.push(`Round ${roundNum}: neither peoplePerGroup nor numberOfGroups specified, will be calculated`);
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Check if a competition reaches the target finalists within tolerance
   * @param {Competition} competition - The competition to check
   * @param {number} tolerance - Acceptable percentage difference (default 10%)
   */
  static checkTargetFinalists(competition, tolerance = 0.1) {
    const actual = competition.getFinalCompetitorCount();
    const target = competition.targetFinalists;

    if (!target) {
      return { met: true, message: 'No target finalists specified' };
    }

    const difference = Math.abs(actual - target);
    const percentDiff = difference / target;

    if (percentDiff <= tolerance) {
      return {
        met: true,
        actual,
        target,
        difference,
        percentDiff: percentDiff * 100,
        message: `Target met: ${actual} finalists (target: ${target}, diff: ${percentDiff.toFixed(2)}%)`
      };
    } else {
      return {
        met: false,
        actual,
        target,
        difference,
        percentDiff: percentDiff * 100,
        message: `Target not met: ${actual} finalists (target: ${target}, diff: ${percentDiff.toFixed(2)}%)`
      };
    }
  }

  /**
   * Validate that round calculations are internally consistent
   * @param {Round[]} rounds - Array of rounds
   */
  static validateRoundConsistency(rounds) {
    const errors = [];

    rounds.forEach((round, index) => {
      // Check that totalCompetitors = numberOfGroups × peoplePerGroup
      if (round.totalCompetitors && round.numberOfGroups && round.peoplePerGroup) {
        const expected = round.numberOfGroups * round.peoplePerGroup;
        if (Math.abs(expected - round.totalCompetitors) > 0.01) {
          errors.push(
            `Round ${index + 1}: Inconsistent calculation: ${round.numberOfGroups} × ${round.peoplePerGroup} = ${expected}, but totalCompetitors is ${round.totalCompetitors}`
          );
        }
      }

      // Check that next round starts with correct number
      if (index < rounds.length - 1) {
        const advancing = round.getAdvancingCompetitors();
        const nextRound = rounds[index + 1];

        if (Math.abs(nextRound.totalCompetitors - advancing) > 0.01) {
          errors.push(
            `Round ${index + 1} → ${index + 2}: Advancing count mismatch. Round ${index + 1} advances ${advancing}, but Round ${index + 2} starts with ${nextRound.totalCompetitors}`
          );
        }
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check for common configuration issues
   */
  static checkCommonIssues(competition) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    // Check for impossible configurations (competitors drop to 0 or near 0)
    let zeroRoundIndex = -1;
    competition.rounds.forEach((round, index) => {
      if (round.totalCompetitors === 0 && zeroRoundIndex === -1) {
        zeroRoundIndex = index;
      }
    });

    if (zeroRoundIndex > 0) {
      errors.push(
        `Configuration is impossible: Round ${zeroRoundIndex + 1} has 0 competitors. ` +
        `The cascade eliminated all competitors by Round ${zeroRoundIndex}. ` +
        `Try using larger gate sizes or fewer rounds.`
      );
    }

    // Check if actual finalists is drastically below target
    const finalRound = competition.rounds[competition.rounds.length - 1];
    if (finalRound && competition.targetFinalists) {
      const actual = finalRound.totalCompetitors;
      const target = competition.targetFinalists;

      if (actual === 0) {
        errors.push(
          `Configuration is impossible: Final round has 0 competitors (target: ${target}). ` +
          `The configuration eliminates too many competitors too quickly.`
        );
      } else if (actual < target * 0.5) {
        warnings.push(
          `Final competitors (${actual}) is less than half the target (${target}). ` +
          `Consider increasing gate sizes to allow more competitors to advance.`
        );
      } else if (actual > target * 2) {
        warnings.push(
          `Final competitors (${actual}) is more than double the target (${target}). ` +
          `Consider decreasing gate sizes or adding more rounds.`
        );
      }
    }

    // Check for very small or very large group sizes
    competition.rounds.forEach((round, index) => {
      if (round.totalCompetitors === 0) {
        return; // Skip rounds with 0 competitors (already reported above)
      }

      if (round.peoplePerGroup && round.peoplePerGroup < 5) {
        warnings.push(`Round ${index + 1}: Very small group size (${round.peoplePerGroup.toFixed(1)}). Consider larger groups.`);
      }
      if (round.peoplePerGroup && round.peoplePerGroup > 100 && index < competition.rounds.length - 1) {
        warnings.push(`Round ${index + 1}: Very large group size (${round.peoplePerGroup.toFixed(1)}). Consider smaller groups.`);
      }

      // Check for non-integer group counts (should not happen with new validation)
      if (round.numberOfGroups && !Number.isInteger(round.numberOfGroups)) {
        warnings.push(
          `Round ${index + 1}: Number of groups must be a whole number, got ${round.numberOfGroups.toFixed(2)}`
        );
      }

      // Check for non-integer advancing competitors
      if (round.numberOfGroups && round.gateSize) {
        const advancing = round.getAdvancingCompetitors();
        if (!Number.isInteger(advancing)) {
          warnings.push(
            `Round ${index + 1}: Advancing competitors must be a whole number, got ${advancing.toFixed(2)}`
          );
        }
      }

      // Check for fractional peoplePerGroup in rounds other than Round 1
      if (index > 0 && round.peoplePerGroup && !Number.isInteger(round.peoplePerGroup)) {
        warnings.push(
          `Round ${index + 1}: peoplePerGroup is fractional (${round.peoplePerGroup.toFixed(2)}). Only Round 1 should have fractional group sizes.`
        );
      }

      // Check if gateSize exceeds peoplePerGroup
      if (round.gateSize > round.peoplePerGroup) {
        errors.push(
          `Round ${index + 1}: gateSize (${round.gateSize}) exceeds peoplePerGroup (${round.peoplePerGroup.toFixed(1)}). ` +
          `Cannot advance more people than are in each group.`
        );
      }
    });

    // Check if final round has exactly 1 group (REQUIRED)
    const lastRound = competition.rounds[competition.rounds.length - 1];
    if (lastRound && lastRound.numberOfGroups !== 1 && lastRound.totalCompetitors > 0) {
      warnings.push(
        `Final round MUST have exactly 1 group, but has ${lastRound.numberOfGroups}. All finalists must compete in a single final group.`
      );
    }

    return {
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * Comprehensive validation report
   */
  static generateReport(competition) {
    const configValidation = this.validateConfig({
      startingCompetitors: competition.startingCompetitors,
      rounds: competition.rounds.map(r => ({
        gateSize: r.gateSize,
        numberOfGroups: r.numberOfGroups,
        peoplePerGroup: r.peoplePerGroup
      }))
    });

    const competitionValidation = competition.validate();
    const consistencyValidation = this.validateRoundConsistency(competition.rounds);
    const targetCheck = this.checkTargetFinalists(competition);
    const commonIssues = this.checkCommonIssues(competition);

    const allErrors = [
      ...configValidation.errors,
      ...competitionValidation.errors,
      ...consistencyValidation.errors,
      ...commonIssues.errors
    ];

    const allWarnings = [
      ...configValidation.warnings,
      ...commonIssues.warnings
    ];

    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      suggestions: commonIssues.suggestions,
      targetCheck,
      summary: competition.getSummary()
    };
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompetitionValidator;
}
