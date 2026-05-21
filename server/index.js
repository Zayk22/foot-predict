const express = require('express');
const cors = require('cors');
require('dotenv').config();

const teamsRouter = require('./routes/teams');
const matchesRouter = require('./routes/matches');
const predictionsRouter = require('./routes/predictions');
const standingsRouter = require('./routes/standings');
const statsRouter = require('./routes/stats');
const aiPredictionsRouter = require('./routes/ai-predictions');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://foot-predict-4lp9.vercel.app',
    'https://foot-predict-phi.vercel.app',
    'https://foot-predict-me1d20dl5-zayk22s-projects.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/teams', teamsRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/standings', standingsRouter);
app.use('/api/stats', statsRouter);
app.use('/api/ai-predictions', aiPredictionsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('⚽ API running on http://0.0.0.0:' + PORT);
  console.log('📍 AI Predictions: http://0.0.0.0:' + PORT + '/api/ai-predictions');
});