/**
 * Represents a single round in a competition
 */
class Round {
  constructor({
    name,
    totalCompetitors = null,
    numberOfGroups = null,
    gateSize,
    peoplePerGroup = null,
    startDate = null,
    endDate = null,
    duration = 4 // default 4 days
  }) {
    this.name = name;
    this.totalCompetitors = totalCompetitors;
    this.numberOfGroups = numberOfGroups;
    this.gateSize = gateSize;
    this.peoplePerGroup = peoplePerGroup;
    this.startDate = startDate;
    this.endDate = endDate;
    this.duration = duration;
  }

  /**
   * Calculate missing value (either numberOfGroups or peoplePerGroup)
   * Requires totalCompetitors to be set
   * IMPORTANT: numberOfGroups will always be rounded to nearest integer
   */
  calculateMissingValue() {
    if (this.totalCompetitors === null || this.totalCompetitors === undefined) {
      throw new Error('totalCompetitors must be set before calculating missing values');
    }

    // Handle edge case: no competitors (impossible configuration)
    if (this.totalCompetitors === 0) {
      this.numberOfGroups = 0;
      this.peoplePerGroup = 0;
      return; // Nothing to calculate
    }

    // Calculate peoplePerGroup if numberOfGroups is set
    if (this.numberOfGroups !== null && this.peoplePerGroup === null) {
      // Ensure numberOfGroups is an integer
      this.numberOfGroups = Math.round(this.numberOfGroups);
      this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
    }
    // Calculate numberOfGroups if peoplePerGroup is set
    else if (this.peoplePerGroup !== null && this.numberOfGroups === null) {
      // Round numberOfGroups to nearest integer
      this.numberOfGroups = Math.round(this.totalCompetitors / this.peoplePerGroup);

      // CRITICAL: Ensure we always have at least 1 group when there are competitors
      // If peoplePerGroup is larger than totalCompetitors, Math.round gives 0
      if (this.numberOfGroups === 0 && this.totalCompetitors > 0) {
        this.numberOfGroups = 1;
      }

      // Recalculate peoplePerGroup to ensure accuracy with rounded groups
      if (this.numberOfGroups > 0) {
        this.peoplePerGroup = this.totalCompetitors / this.numberOfGroups;
      }
    }
    // Both are set - validate they match
    else if (this.numberOfGroups !== null && this.peoplePerGroup !== null) {
      // Ensure numberOfGroups is an integer
      this.numberOfGroups = Math.round(this.numberOfGroups);
      const calculated = this.numberOfGroups * this.peoplePerGroup;
      if (Math.abs(calculated - this.totalCompetitors) > 0.01) {
        console.warn(
          `Warning: numberOfGroups (${this.numberOfGroups}) × peoplePerGroup (${this.peoplePerGroup}) = ${calculated}, but totalCompetitors is ${this.totalCompetitors}`
        );
      }
    }
  }

  /**
   * Calculate the number of competitors advancing to the next round
   * Always returns a whole number (integer)
   */
  getAdvancingCompetitors() {
    if (this.numberOfGroups === null || this.gateSize === null) {
      throw new Error('numberOfGroups and gateSize must be set to calculate advancing competitors');
    }
    // Ensure both are integers and result is integer
    return Math.round(this.numberOfGroups) * Math.round(this.gateSize);
  }

  /**
   * Calculate end date from start date and duration
   */
  calculateEndDate() {
    if (!this.startDate) {
      return;
    }

    const start = new Date(this.startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + this.duration - 1); // -1 because start date counts as day 1

    this.endDate = end.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

  /**
   * Validate the round configuration
   */
  validate() {
    const errors = [];

    if (!this.name) errors.push('Round must have a name');
    if (this.gateSize === null || this.gateSize <= 0) errors.push('gateSize must be positive');
    if (this.totalCompetitors !== null && this.totalCompetitors <= 0) errors.push('totalCompetitors must be positive');
    if (this.numberOfGroups !== null && this.numberOfGroups <= 0) errors.push('numberOfGroups must be positive');
    if (this.peoplePerGroup !== null && this.peoplePerGroup <= 0) errors.push('peoplePerGroup must be positive');

    // Validate numberOfGroups is an integer
    if (this.numberOfGroups !== null && !Number.isInteger(this.numberOfGroups)) {
      errors.push(`numberOfGroups must be a whole number, got ${this.numberOfGroups}`);
    }

    // Validate gateSize is an integer
    if (this.gateSize !== null && !Number.isInteger(this.gateSize)) {
      errors.push(`gateSize must be a whole number, got ${this.gateSize}`);
    }

    // Validate advancing competitors is an integer
    if (this.numberOfGroups !== null && this.gateSize !== null) {
      const advancing = this.getAdvancingCompetitors();
      if (!Number.isInteger(advancing)) {
        errors.push(`Advancing competitors must be a whole number, got ${advancing}`);
      }
    }

    // Validate calculation consistency
    if (this.totalCompetitors && this.numberOfGroups && this.peoplePerGroup) {
      const calculated = this.numberOfGroups * this.peoplePerGroup;
      if (Math.abs(calculated - this.totalCompetitors) > 0.01) {
        errors.push(
          `Inconsistent values: ${this.numberOfGroups} groups × ${this.peoplePerGroup} people/group = ${calculated}, but totalCompetitors is ${this.totalCompetitors}`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Convert to plain object for JSON serialization
   */
  toJSON() {
    return {
      name: this.name,
      totalCompetitors: this.totalCompetitors,
      numberOfGroups: this.numberOfGroups,
      gateSize: this.gateSize,
      peoplePerGroup: this.peoplePerGroup,
      startDate: this.startDate,
      endDate: this.endDate,
      duration: this.duration,
      advancing: this.numberOfGroups && this.gateSize ? this.getAdvancingCompetitors() : null
    };
  }

  /**
   * Create Round from plain object
   */
  static fromJSON(obj) {
    return new Round(obj);
  }

  /**
   * Clone this round
   */
  clone() {
    return Round.fromJSON(this.toJSON());
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Round;
}
