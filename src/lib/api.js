const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

export async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const endpoints = {
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  players: (params = '') => api(`/players${params}`),
  createPlayer: (data) => api('/players', { method: 'POST', body: JSON.stringify(data) }),
  draft: (data) => api('/draft', { method: 'POST', body: JSON.stringify(data) }),
  getDraft: (userId, week) => api(`/draft/${userId}/${week}`),
  leaderboard: (params = '') => api(`/leaderboard${params}`),
  createLeague: (data) => api('/leagues', { method: 'POST', body: JSON.stringify(data) }),
  joinLeague: (code, userId) => api(`/leagues/join?code=${code}&user_id=${userId}`, { method: 'POST' }),
  getLeague: (leagueId) => api(`/leagues/${leagueId}`),
  transfer: (data) => api('/transfer', { method: 'POST', body: JSON.stringify(data) }),
  notifications: () => api('/notifications'),
  createNotification: (data) => api('/notifications', { method: 'POST', body: JSON.stringify(data) }),
  weeks: () => api('/weeks'),
  createWeek: (data) => api('/weeks', { method: 'POST', body: JSON.stringify(data) }),
};

export const roleColors = {
  tank: 'bg-cyan-600',
  mage: 'bg-purple-600',
  assassin: 'bg-pink-600',
  support: 'bg-emerald-600',
  marksman: 'bg-amber-500',
  fighter: 'bg-red-600',
  roamer: 'bg-teal-600',
  goldlane: 'bg-yellow-600',
  midlane: 'bg-indigo-600',
  exp: 'bg-orange-600',
  jungler: 'bg-lime-600',
};
