const KEY = "agrioneLanguage";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '"ro"'); }
  catch { return "ro"; }
};

export const languageStore = {
  getLanguage() { return read(); },
  setLanguage(lang) {
    const valid = lang === "en" ? "en" : "ro";
    localStorage.setItem(KEY, JSON.stringify(valid));
    return valid;
  },
  toggleLanguage() {
    const current = this.getLanguage();
    return this.setLanguage(current === "ro" ? "en" : "ro");
  },
  initLanguage() { return this.getLanguage(); },
};