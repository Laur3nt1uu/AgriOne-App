const KEY = "agrione_auth";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || "null"); }
  catch { return null; }
};

export const authStore = {
  getToken() { return read()?.token || null; },
  getUser() { return read()?.user || null; },
  isAuthed() { return !!this.getToken(); },
  setAuth({ token, user }) { localStorage.setItem(KEY, JSON.stringify({ token, user })); },
  logout() { localStorage.removeItem(KEY); },
};