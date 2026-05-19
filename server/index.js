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

app.use(cors({
  origin: ['https://foot-predict-me1d20dl5-zayk22s-projects.vercel.app', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/standings', standingsRouter);
app.use('/api/stats', statsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('⚽ API running on http://0.0.0.0:' + PORT);
  console.log('📍 Health: http://0.0.0.0:' + PORT + '/api/health');
  console.log('📍 Teams: http://0.0.0.0:' + PORT + '/api/teams');
  console.log('📍 Matches: http://0.0.0.0:' + PORT + '/api/matches');
  console.log('📍 Predictions: http://0.0.0.0:' + PORT + '/api/predictions');
  console.log('📍 Standings: http://0.0.0.0:' + PORT + '/api/standings');
  console.log('📍 Stats: http://0.0.0.0:' + PORT + '/api/stats');
});