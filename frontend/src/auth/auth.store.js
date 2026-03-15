const KEY = "agrione_auth";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
};

export const authStore = {
  // Existing methods (maintained compatibility)
  getToken() { return read()?.token || null; },
  getUser() { return read()?.user || null; },
  isAuthed() { return !!this.getToken(); },
  setAuth({ token, user }) {
    const provider = user?.provider || 'local';
    localStorage.setItem(KEY, JSON.stringify({ token, user, provider, timestamp: Date.now() }));
  },
  logout() { localStorage.removeItem(KEY); },

  // OAuth methods (Google only)
  getProvider() { return read()?.provider || 'local'; },
  isOAuth() { return this.getProvider() === 'google'; },
  isGoogle() { return this.getProvider() === 'google'; },

  // Google OAuth setter
  setGoogleAuth({ token, user, googleToken }) {
    const enrichedUser = { ...user, provider: 'google' };
    localStorage.setItem(KEY, JSON.stringify({
      token,
      user: enrichedUser,
      provider: 'google',
      googleToken,
      timestamp: Date.now()
    }));
  },

  // Get Google token
  getGoogleToken() { return read()?.googleToken || null; },

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