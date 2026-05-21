const express = require('express');
const router = express.Router();
const { getUpcomingMatches } = require('../services/footballData');

router.get('/', async (req, res) => {
  try {
    if (!process.env.FOOTBALL_DATA_KEY) {
      return res.json({ success: true, count: 0, data: [], source: 'none' });
    }

    const realMatches = await getUpcomingMatches();
    
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

    res.json({ success: true, count: formatted.length, data: formatted, source: 'live' });
  } catch (err) {
    console.error('Football API error:', err.message);
    res.json({ success: true, count: 0, data: [], source: 'error' });
  }
});

router.get('/live', async (req, res) => {
  try {
    if (!process.env.FOOTBALL_DATA_KEY) {
      return res.json({ success: true, count: 0, data: [], source: 'none' });
    }

    const { getTodaysMatches } = require('../services/footballData');
    const realMatches = await getTodaysMatches();
    
    const liveMatches = realMatches.filter(m => 
      m.status === 'IN_PLAY' || m.status === 'PAUSED' || m.status === 'LIVE'
    );
    
    const formatted = liveMatches.map((m) => ({
      id: m.id,
      match_date: m.utcDate,
      league: m.competition?.name || 'N/A',
      status: 'live',
      home_score: m.score?.fullTime?.home ?? 0,
      away_score: m.score?.fullTime?.away ?? 0,
      home_team: { name: m.homeTeam.name, short_name: m.homeTeam.tla },
      away_team: { name: m.awayTeam.name, short_name: m.awayTeam.tla },
    }));

    res.json({ success: true, count: formatted.length, data: formatted, source: 'live' });
  } catch (err) {
    res.json({ success: true, count: 0, data: [], source: 'error' });
  }
});

module.exports = router;