const express = require('express');
const router = express.Router();
const supabase = require('../db');

// GET /api/teams — Fetch all teams
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch teams' });
    }

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/teams/:id — Fetch a single team by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;