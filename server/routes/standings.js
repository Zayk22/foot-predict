const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
  try {
    const league = req.query.league || 'Premier League';

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
        league: row.team?.league,
        country: row.team?.country,
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
      .map((row, index) => ({
        ...row,
        position: index + 1,
      }));

    res.json({ success: true, league, count: standings.length, data: standings });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;