const API_BASE = 'https://api.football-data.org/v4';

async function fetchFromFootballAPI(endpoint) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'X-Auth-Token': process.env.FOOTBALL_DATA_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Football API error: ${response.status}`);
  }

  return response.json();
}

// Get Premier League standings
async function getPLStandings() {
  const data = await fetchFromFootballAPI('/competitions/PL/standings');
  return data.standings[0]?.table || [];
}

// Get matches for the next 7 days across ALL competitions
async function getUpcomingMatches() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const data = await fetchFromFootballAPI(`/matches?dateFrom=${today}&dateTo=${nextWeek}`);
  return data.matches || [];
}

// Get today's matches
async function getTodaysMatches() {
  const today = new Date().toISOString().split('T')[0];
  const data = await fetchFromFootballAPI(`/matches?dateFrom=${today}&dateTo=${today}`);
  return data.matches || [];
}

module.exports = {
  getPLStandings,
  getUpcomingMatches,
  getTodaysMatches,
};