const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { getPLStandings } = require('../services/footballData');

router.get('/', async (req, res) => {
  try {
    const league = req.query.league || 'Premier League';

    // Try real API first for Premier League
    if (league === 'Premier League' && process.env.FOOTBALL_DATA_KEY) {
      try {
        const realStandings = await getPLStandings();
        if (realStandings.length > 0) {
          const formatted = realStandings.map((row) => ({
            id: row.team.id,
            name: row.team.name,
            short_name: row.team.tla,
            position: row.position,
            played: row.playedGames,
            won: row.won,
            drawn: row.draw,
            lost: row.lost,
            goals_for: row.goalsFor,
            goals_against: row.goalsAgainst,
            points: row.points,
            form: (row.form || 'WDWLW').split(','),
          }));
          return res.json({ success: true, league, count: formatted.length, data: formatted, source: 'live' });
        }
      } catch (err) {
        console.log('Falling back to database:', err.message);
      }
    }

    // Fallback to Supabase
    const { data, error } = await supabase
      .from('team_stats')
      .select('*, team:team_id(id, name, short_name, league, country)')
      .filter('team.league', 'eq', league);

    if (error) return res.status(500).json({ error: error.message });

    const standings = data
      .map((row) => ({
        id: row.team?.id,
        name: row.team?.name,
        short_name: row.team?.short_name,
        position: row.team?.id,
        played: row.played,
        won: row.wins,
        drawn: row.draws,
        lost: row.losses,
        goals_for: row.goals_for,
        goals_against: row.goals_against,
        points: row.points,
        form: (row.form || 'WDWLW').split(''),
      }))
      .sort((a, b) => b.points - a.points)
      .map((row, index) => ({ ...row, position: index + 1 }));

    res.json({ success: true, league, count: standings.length, data: standings, source: 'database' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;