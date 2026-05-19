const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/stats/team/:teamId
router.get('/team/:teamId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('team_stats')
      .select('*')
      .eq('team_id', req.params.teamId)
      .single();

    if (error) return res.status(404).json({ error: 'Stats not found' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/stats/league?league=Premier League
router.get('/league', async (req, res) => {
  try {
    const league = req.query.league || 'Premier League';

    const { data, error } = await supabase
      .from('team_stats')
      .select('*, team:team_id(name, short_name, league)')
      .filter('team.league', 'eq', league);

    if (error) return res.status(500).json({ error: error.message });

    const sorted = data.sort((a, b) => b.points - a.points);
    res.json({ success: true, count: sorted.length, data: sorted });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;