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

// Get Premier League standings (competition ID 2021)
async function getPLStandings() {
  const data = await fetchFromFootballAPI('/competitions/PL/standings');
  return data.standings[0]?.table || [];
}

// Get upcoming Premier League matches
async function getPLMatches() {
  const data = await fetchFromFootballAPI('/competitions/PL/matches?status=SCHEDULED');
  return data.matches || [];
}

// Get today's matches across competitions
async function getTodaysMatches() {
  const today = new Date().toISOString().split('T')[0];
  const data = await fetchFromFootballAPI(`/matches?dateFrom=${today}&dateTo=${today}`);
  return data.matches || [];
}

module.exports = {
  getPLStandings,
  getPLMatches,
  getTodaysMatches,
};