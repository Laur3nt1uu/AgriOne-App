const KEY = "agrione_auth";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
};

export const authStore = {
  // Existing methods (maintained compatibility)
  getToken() { return read()?.token || null; },
  getRefreshToken() { return read()?.refreshToken || null; },
  getUser() { return read()?.user || null; },
  isAuthed() { return !!this.getToken(); },
  setAuth({ token, user, refreshToken }) {
    const provider = user?.provider || 'local';
    localStorage.setItem(KEY, JSON.stringify({ token, refreshToken, user, provider, timestamp: Date.now() }));
  },
  logout() { localStorage.removeItem(KEY); },

  // OAuth methods (Google only)
  getProvider() { return read()?.provider || 'local'; },
  isOAuth() { return this.getProvider() === 'google'; },
  isGoogle() { return this.getProvider() === 'google'; },

  // Google OAuth setter
  setGoogleAuth({ token, user, googleToken, refreshToken }) {
    const enrichedUser = { ...user, provider: 'google' };
    localStorage.setItem(KEY, JSON.stringify({
      token,
      refreshToken,
      user: enrichedUser,
      provider: 'google',
      googleToken,
      timestamp: Date.now()
    }));
  },

  // Get Google token
  getGoogleToken() { return read()?.googleToken || null; },

  // Update tokens after a refresh (preserves everything else)
  updateTokens({ token, refreshToken }) {
    const data = read();
    if (!data) return;
    if (token) data.token = token;
    if (refreshToken) data.refreshToken = refreshToken;
    data.timestamp = Date.now();
    localStorage.setItem(KEY, JSON.stringify(data));
  },

  // Check if session is expired (24 hours for Google OAuth, 7 days for local)
  isExpired() {
    const data = read();
    if (!data?.timestamp) return false;
    const isGoogleAuth = data.provider === 'google';
    const expireTime = isGoogleAuth ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    return Date.now() - data.timestamp > expireTime;
  },

  // Plan helpers
  getPlan() { return this.getUser()?.plan || "STARTER"; },
  updateUser(partial) {
    const data = read();
    if (!data) return;
    data.user = { ...data.user, ...partial };
    localStorage.setItem(KEY, JSON.stringify(data));
  },
};