const express = require('express');
const cors = require('cors');
require('dotenv').config();

const teamsRouter = require('./routes/teams');
const matchesRouter = require('./routes/matches');
const predictionsRouter = require('./routes/predictions');
const standingsRouter = require('./routes/standings');
const statsRouter = require('./routes/stats');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/standings', standingsRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log('⚽ API running on http://localhost:' + PORT);
  console.log('📍 Health: http://localhost:' + PORT + '/api/health');
  console.log('📍 Teams: http://localhost:' + PORT + '/api/teams');
  console.log('📍 Matches: http://localhost:' + PORT + '/api/matches');
  console.log('📍 Predictions: http://localhost:' + PORT + '/api/predictions');
  console.log('📍 Standings: http://localhost:' + PORT + '/api/standings');
  console.log('📍 Stats: http://localhost:' + PORT + '/api/stats');
});