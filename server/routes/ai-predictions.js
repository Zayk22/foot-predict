const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../services/footballData');
const { predictMatch, getTopPick } = require('../services/predictionEngine');

// Covered leagues
const COVERED_LEAGUES = ['Premier League', 'La Liga', 'UEFA Champions League'];

router.get('/', async (req, res) => {
  try {
    if (!process.env.FOOTBALL_DATA_KEY) {
      return res.json({ success: false, error: 'API key not configured' });
    }

    // Fetch real upcoming fixtures
    const allMatches = await getUpcomingMatches();

    // Filter for covered leagues and future matches only
    const now = new Date();
    const coveredMatches = allMatches.filter((m) =>
      COVERED_LEAGUES.some((league) => m.competition?.name?.includes(league)) &&
      new Date(m.utcDate) > now
    );

    // Generate predictions for each match
    const totalTeams = 20; // Assume 20-team league
    const predictions = coveredMatches.map((m) => {
      // Use team IDs as position proxies (in production, fetch real standings)
      const homePos = (m.homeTeam.id % totalTeams) + 1;
      const awayPos = (m.awayTeam.id % totalTeams) + 1;

      const matchPredictions = predictMatch(
        m.homeTeam.name,
        m.awayTeam.name,
        homePos,
        awayPos,
        totalTeams
      );

      const topPick = getTopPick(matchPredictions);

      return {
        id: m.id,
        match: {
          match_date: m.utcDate,
          league: m.competition?.name || 'N/A',
          home_team: { name: m.homeTeam.name, short_name: m.homeTeam.tla },
          away_team: { name: m.awayTeam.name, short_name: m.awayTeam.tla },
        },
        topPick,
        allPredictions: [
          matchPredictions.homeWin,
          matchPredictions.draw,
          matchPredictions.awayWin,
          matchPredictions.over25,
          matchPredictions.under25,
          matchPredictions.bttsYes,
          matchPredictions.bttsNo,
        ],
      };
    });

    // Sort by top pick confidence
    predictions.sort((a, b) => b.topPick.probability - a.topPick.probability);

    res.json({
      success: true,
      count: predictions.length,
      data: predictions,
      source: 'ai-engine',
      generated: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Prediction engine error:', err.message);
    res.json({ success: true, count: 0, data: [], source: 'error' });
  }
});

module.exports = router;