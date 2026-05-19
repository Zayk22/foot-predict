const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('predictions')
      .select('*, match:match_id(match_date, league, home_team:home_team_id(name), away_team:away_team_id(name))')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;