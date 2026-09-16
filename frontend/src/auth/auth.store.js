const KEY = "agrione_auth";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
};

export const authStore = {
  getToken() { return read()?.token || null; },
  getRefreshToken() { return read()?.refreshToken || null; },
  getUser() { return read()?.user || null; },
  isAuthed() { return !!this.getToken(); },
  setAuth({ token, user, refreshToken }) {
    const provider = user?.provider || 'local';
    localStorage.setItem(KEY, JSON.stringify({ token, refreshToken, user, provider, timestamp: Date.now() }));
  },
  logout() { localStorage.removeItem(KEY); },

  getProvider() { return read()?.provider || 'local'; },
  isOAuth() { return this.getProvider() === 'google'; },
  isGoogle() { return this.getProvider() === 'google'; },

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

  getGoogleToken() { return read()?.googleToken || null; },

  updateTokens({ token, refreshToken }) {
    const data = read();
    if (!data) return;
    if (token) data.token = token;
    if (refreshToken) data.refreshToken = refreshToken;
    data.timestamp = Date.now();
    localStorage.setItem(KEY, JSON.stringify(data));
  },

  isExpired() {
    const data = read();
    if (!data?.timestamp) return false;
    const isGoogleAuth = data.provider === 'google';
    const expireTime = isGoogleAuth ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    return Date.now() - data.timestamp > expireTime;
  },

  getPlan() { return this.getUser()?.plan || "STARTER"; },
  updateUser(partial) {
    const data = read();
    if (!data) return;
    data.user = { ...data.user, ...partial };
    localStorage.setItem(KEY, JSON.stringify(data));
  },
};