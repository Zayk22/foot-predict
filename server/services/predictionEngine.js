/**
 * Simple prediction engine based on league position and home advantage.
 * In production, replace with real ML model.
 */

function predictMatch(homeTeam, awayTeam, homePos, awayPos, totalTeams) {
  // Home advantage factor
  const homeAdvantage = 0.15;

  // Position-based strength (higher position = stronger)
  const homeStrength = 1 - (homePos / totalTeams);
  const awayStrength = 1 - (awayPos / totalTeams);

  // Base probabilities
  const total = homeStrength + awayStrength;
  let homeWinProb = (homeStrength / total) * (1 + homeAdvantage);
  let awayWinProb = (awayStrength / total) * (1 - homeAdvantage);
  let drawProb = 1 - homeWinProb - awayWinProb;

  // Normalize
  const sum = homeWinProb + awayWinProb + drawProb;
  homeWinProb = (homeWinProb / sum) * 100;
  awayWinProb = (awayWinProb / sum) * 100;
  drawProb = (drawProb / sum) * 100;

  // Over/Under 2.5 based on average goals
  const avgGoals = 2.8;
  const overProb = Math.min(85, Math.max(40, avgGoals * 20 + Math.random() * 15));
  const underProb = 100 - overProb;

  // BTTS probability (correlates with over 2.5)
  const bttsProb = Math.min(82, overProb - 5 + Math.random() * 10);
  const noBttsProb = 100 - bttsProb;

  // Round and add slight randomness for realism
  const round = (n) => Math.round(n);

  return {
    homeWin: { outcome: `${homeTeam} Win`, probability: round(homeWinProb) },
    awayWin: { outcome: `${awayTeam} Win`, probability: round(awayWinProb) },
    draw: { outcome: 'Draw', probability: round(drawProb) },
    over25: { outcome: 'Over 2.5 Goals', probability: round(overProb) },
    under25: { outcome: 'Under 2.5 Goals', probability: round(underProb) },
    bttsYes: { outcome: 'Both Teams to Score', probability: round(bttsProb) },
    bttsNo: { outcome: 'No BTTS', probability: round(noBttsProb) },
  };
}

// Get the top pick (highest probability)
function getTopPick(predictions) {
  const all = [
    predictions.homeWin,
    predictions.awayWin,
    predictions.draw,
    predictions.over25,
    predictions.under25,
    predictions.bttsYes,
    predictions.bttsNo,
  ];
  return all.reduce((best, curr) => (curr.probability > best.probability ? curr : best));
}

module.exports = { predictMatch, getTopPick };