const KEY = "agrioneTheme";

const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '"dark"'); }
  catch { return "dark"; }
};

const applyTheme = (theme) => {
  if (theme === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }
};

export const themeStore = {
  getTheme() { return read(); },
  setTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";
    localStorage.setItem(KEY, JSON.stringify(validTheme));
    applyTheme(validTheme);
    return validTheme;
  },
  toggleTheme() {
    const current = this.getTheme();
    const newTheme = current === "light" ? "dark" : "light";
    return this.setTheme(newTheme);
  },
  initTheme() {
    const theme = this.getTheme();
    applyTheme(theme);
    return theme;
  },
};
