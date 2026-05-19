const express = require('express');
const app = express();
const supabase = require('./db');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/teams', async (req, res) => {
  const { data, error } = await supabase.from('teams').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(5000, () => {
  console.log('Server running on 5000');
});