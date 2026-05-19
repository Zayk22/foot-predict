const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchFromAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return { data, error: null };
  } catch (error: any) {
    console.error('API fetch error:', error);

    return {
      data: null,
      error: error.message,
    };
  }
}

export async function getTeams() {
  return fetchFromAPI('/teams');
}

export async function getTeam(id: string | number) {
  return fetchFromAPI(`/teams/${id}`);
}

export async function getMatches() {
  return fetchFromAPI('/matches');
}

export async function getLiveMatches() {
  return fetchFromAPI('/matches/live');
}

export async function getPredictions() {
  return fetchFromAPI('/predictions');
}

export async function getPredictionsForMatch(matchId: string | number) {
  return fetchFromAPI(`/predictions/match/${matchId}`);
}

export async function getStandings(league = 'Premier League') {
  return fetchFromAPI(`/standings?league=${encodeURIComponent(league)}`);
}

export async function getTeamStats(teamId: number) {
  return fetchFromAPI(`/stats/team/${teamId}`);
}

export async function getLeagueStats(league: string = 'Premier League') {
  return fetchFromAPI(`/stats/league?league=${encodeURIComponent(league)}`);
}