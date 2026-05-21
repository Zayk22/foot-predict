const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { getPLMatches, getTodaysMatches } = require('../services/footballData');

router.get('/', async (req, res) => {
  try {
    // Try real API
    if (process.env.FOOTBALL_DATA_KEY) {
      try {
        const realMatches = await getTodaysMatches();
        if (realMatches.length > 0) {
          const formatted = realMatches.map((m) => ({
            id: m.id,
            match_date: m.utcDate,
            league: m.competition?.name || 'N/A',
            status: m.status === 'IN_PLAY' || m.status === 'PAUSED' ? 'live' : m.status === 'FINISHED' ? 'finished' : 'scheduled',
            home_score: m.score?.fullTime?.home ?? null,
            away_score: m.score?.fullTime?.away ?? null,
            home_team: { name: m.homeTeam.name, short_name: m.homeTeam.tla },
            away_team: { name: m.awayTeam.name, short_name: m.awayTeam.tla },
          }));
          return res.json({ success: true, count: formatted.length, data: formatted, source: 'live' });
        }
      } catch (err) {
        console.log('Falling back to database:', err.message);
      }
    }

    // Fallback to Supabase
    const { data, error } = await supabase
      .from('matches')
      .select('*, home_team:home_team_id(name, short_name), away_team:away_team_id(name, short_name)')
      .order('match_date', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, count: data.length, data, source: 'database' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;