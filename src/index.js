/**
 * Competition Configuration System
 * Main entry point
 */

const Round = require('./models/Round');
const Competition = require('./models/Competition');
const RoundCalculator = require('./calculators/RoundCalculator');
const CompetitionValidator = require('./validators/CompetitionValidator');

module.exports = {
  Round,
  Competition,
  RoundCalculator,
  CompetitionValidator
};
