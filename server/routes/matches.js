const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*, home_team:home_team_id(name, short_name), away_team:away_team_id(name, short_name)')
      .order('match_date', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;