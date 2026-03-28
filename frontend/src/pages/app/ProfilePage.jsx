import { useEffect, useMemo, useState } from "react";
import { authStore } from "../../auth/auth.store";
import { useTheme } from "../../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { KeyRound, LogOut, MapPin, Shield, User as UserIcon, Sun, Moon, Crown, MessageSquare } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import PremiumFeatureGate from "../../components/PremiumFeatureGate";

export default function ProfilePage() {
  const nav = useNavigate();
  const [user] = useState(authStore.getUser());

  const isAdmin = user?.role === "ADMIN";

  const displayName =
    user?.name ||
    user?.username ||
    (user?.email ? String(user.email).split("@")[0] : "") ||
    (user?.role === "ADMIN" ? "Administrator" : "Utilizator");

  const [prefsBusy, setPrefsBusy] = useState(true);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefName, setPrefName] = useState("");
  const [prefLat, setPrefLat] = useState("");
  const [prefLng, setPrefLng] = useState("");
  const [savedLocation, setSavedLocation] = useState(null);

  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNext, setPwdNext] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");

  const savedLabel = useMemo(() => {
    if (!savedLocation?.lat || !savedLocation?.lng) return "Neconfigurată";
    const n = savedLocation?.name ? `${savedLocation.name} • ` : "";
    return `${n}${Number(savedLocation.lat).toFixed(5)}, ${Number(savedLocation.lng).toFixed(5)}`;
  }, [savedLocation]);

  async function loadPreferences(silent = true) {
    setPrefsBusy(true);
    try {
      const p = await api.auth.getPreferences();
      const gl = p?.globalLocation || null;
      setSavedLocation(gl);
    } catch (e) {
      setSavedLocation(null);
      if (!silent) toastError(e, "Nu pot încărca preferințele.");
    } finally {
      setPrefsBusy(false);
    }
  }

  useEffect(() => {
    loadPreferences(true);
  }, []);

  function openPrefs() {
    const gl = savedLocation || null;
    setPrefName(gl?.name || "");
    setPrefLat(gl?.lat != null ? String(gl.lat) : "");
    setPrefLng(gl?.lng != null ? String(gl.lng) : "");
    setPrefsOpen(true);
  }

  function openPassword() {
    setPwdCurrent("");
    setPwdNext("");
    setPwdConfirm("");
    setPwdOpen(true);
  }

  async function changePassword() {
    if (pwdSaving) return;
    if (!pwdCurrent || !pwdNext) {
      toastError(null, "Completează parola curentă și parola nouă.");
      return;
    }
    if (pwdNext.length < 6) {
      toastError(null, "Parola nouă trebuie să aibă cel puțin 6 caractere.");
      return;
    }
    if (pwdNext !== pwdConfirm) {
      toastError(null, "Confirmarea parolei nu coincide.");
      return;
    }

    setPwdSaving(true);
    try {
      await api.auth.changePassword({ currentPassword: pwdCurrent, newPassword: pwdNext });
      toastSuccess("Parola a fost schimbată.");
      setPwdOpen(false);
      setPwdCurrent("");
      setPwdNext("");
      setPwdConfirm("");
    } catch (e) {
      toastError(e, "Nu pot schimba parola.");
    } finally {
      setPwdSaving(false);
    }
  }

  async function fillPrefsFromDevice() {
    if (!navigator?.geolocation) {
      toastError(null, "Browser-ul nu suportă geolocație.");
      return;
    }

    if (!window.isSecureContext && !["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      toastError(null, "Geolocația necesită HTTPS sau acces pe localhost.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos?.coords?.latitude);
        const lng = Number(pos?.coords?.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          toastError(null, "Nu pot obține coordonatele.");
          return;
        }
        setPrefLat(String(lat));
        setPrefLng(String(lng));
        if (!prefName) setPrefName("Locația mea");
      },
      (err) => {
        const code = err?.code;
        if (code === 1) return toastError(null, "Permisiunea pentru locație a fost refuzată.");
        if (code === 2) return toastError(null, "Nu pot determina locația (indisponibil). Încearcă din nou.");
        if (code === 3) return toastError(null, "Timeout la geolocație. Încearcă din nou.");
        return toastError(null, "Nu pot obține locația.");
      },
      { enableHighAccuracy: false, timeout: 7000, maximumAge: 5 * 60 * 1000 }
    );
  }

  async function savePreferences() {
    const lat = Number(prefLat);
    const lng = Number(prefLng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      toastError(null, "Coordonate invalide.");
      return;
    }

    setPrefSaving(true);
    try {
      const next = await api.auth.updatePreferences({
        globalLocation: {
          name: prefName?.trim?.() || undefined,
          lat,
          lng,
        },
      });

      setSavedLocation(next?.globalLocation || null);
      setPrefsOpen(false);
      toastSuccess("Preferințele au fost salvate.");
    } catch (e) {
      toastError(e, "Nu pot salva preferințele.");
    } finally {
      setPrefSaving(false);
    }
  }

  async function clearPreferences() {
    setPrefSaving(true);
    try {
      await api.auth.updatePreferences({ globalLocation: null });
      setSavedLocation(null);
      setPrefName("");
      setPrefLat("");
      setPrefLng("");
      setPrefsOpen(false);
      toastSuccess("Locația a fost ștearsă.");
    } catch (e) {
      toastError(e, "Nu pot șterge preferințele.");
    } finally {
      setPrefSaving(false);
    }
  }

  function logout() {
    authStore.logout();
    nav("/auth/login", { replace: true });
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="card p-6 agri-pattern relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center">
            <span className="text-foreground font-extrabold text-2xl">
              {(displayName || "U")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-2xl font-extrabold">{displayName}</div>
            <div className="muted">{user?.email || "—"}</div>
            {user?.role && (
              <Badge className="inline-block mt-2" variant={user.role === "ADMIN" ? "success" : "default"}>
                {user.role}
              </Badge>
            )}
          </div>

          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="icon-chip" title="Profil">
              <UserIcon size={20} className="text-muted-foreground" />
            </span>
            {user?.role === "ADMIN" ? (
              <span className="icon-chip" title="Admin">
                <Shield size={20} className="text-muted-foreground" />
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Motion.div className="card p-5 agri-pattern" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 * 0.05 }}>
        <div className="text-xl font-bold">Preferințe</div>
        <ThemePreference />

        <div className="mt-3 card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]">
          <div>
            <div className="font-semibold">Locație globală</div>
            <div className="text-sm muted">
              {prefsBusy ? "Se încarcă…" : savedLabel}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => loadPreferences(false)} disabled={prefsBusy || prefSaving}>
              Actualizează
            </Button>
            <Button variant="primary" onClick={openPrefs} disabled={prefsBusy || prefSaving}>
              Setează
            </Button>
            <span className="icon-chip" title="Locație">
              <MapPin size={18} className="text-muted-foreground" />
            </span>
          </div>
        </div>

        <div className="mt-3 card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]">
          <div>
            <div className="font-semibold">Schimbă parola</div>
            <div className="text-sm muted">Actualizează parola contului</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={openPassword} disabled={pwdSaving}>
              Schimbă
            </Button>
            <span className="icon-chip" title="Parolă">
              <KeyRound size={18} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </Motion.div>

      {/* SMS Notifications */}
      <Motion.div className="card p-5 agri-pattern" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
        <div className="text-xl font-bold">Notificări</div>

        {/* SMS Settings - Pro Feature */}
        <PremiumFeatureGate
          feature="sms_alerts"
          customMessage="Alertele SMS sunt disponibile în planul Pro pentru notificări instant pe telefon."
        >
          <div className="mt-3 card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]">
            <div>
              <div className="font-semibold">Alerte SMS</div>
              <div className="text-sm muted">Primește notificări critice pe telefon</div>
              <div className="text-xs muted mt-1">
                Configurează numărul de telefon pentru alerte instant
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm">
                Configurează
              </Button>
              <span className="icon-chip" title="SMS">
                <MessageSquare size={18} className="text-muted-foreground" />
              </span>
            </div>
          </div>
        </PremiumFeatureGate>

        {/* Email Settings (always available) */}
        <div className="mt-3 card-soft p-4 flex items-center justify-between gap-3">
          <div>
            <div className="font-semibold">Alerte Email</div>
            <div className="text-sm muted">Notificări pe email pentru toate alertele</div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success">Activ</Badge>
          </div>
        </div>
      </Motion.div>

      {/* Subscription Plan */}
      <Motion.div className="card p-5 agri-pattern" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="text-xl font-bold">Abonament</div>
        <div className="mt-3 card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]">
          <div>
            <div className="font-semibold">{user?.plan || "STARTER"}</div>
            <div className="text-sm muted">Planul tău curent</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={() => nav("/app/plan")}>
              Schimbă planul
            </Button>
            <span className="icon-chip" title="Abonament">
              <Crown size={18} className="text-muted-foreground" />
            </span>
          </div>
        </div>
      </Motion.div>

      <AnimatePresence>
      {prefsOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPrefsOpen(false);
          }}
        >
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Locație globală</div>
                <div className="muted text-sm mt-1">Salvată în cont și folosită pentru meteo/recomandări.</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setPrefsOpen(false)} disabled={prefSaving} title="Închide">
                ✕
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prefName">Nume (opțional)</Label>
                <Input
                  id="prefName"
                  value={prefName}
                  onChange={(e) => setPrefName(e.target.value)}
                  placeholder="ex: Iași / Ferma bunicilor"
                  disabled={prefSaving}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="prefLat">Latitudine</Label>
                  <Input
                    id="prefLat"
                    value={prefLat}
                    onChange={(e) => setPrefLat(e.target.value)}
                    placeholder="ex: 47.158"
                    disabled={prefSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prefLng">Longitudine</Label>
                  <Input
                    id="prefLng"
                    value={prefLng}
                    onChange={(e) => setPrefLng(e.target.value)}
                    placeholder="ex: 27.601"
                    disabled={prefSaving}
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-between">
                <Button type="button" variant="ghost" onClick={fillPrefsFromDevice} disabled={prefSaving}>
                  Locația mea
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="ghost" onClick={clearPreferences} disabled={prefSaving}>
                    Șterge
                  </Button>
                  <Button type="button" variant="primary" onClick={savePreferences} disabled={prefSaving}>
                    {prefSaving ? "Se salvează..." : "Salvează"}
                  </Button>
                </div>
              </div>

              {isAdmin ? (
                <div className="muted text-xs">
                  Pentru ADMIN, locația globală e utilă la meteo/recomandări când analizezi terenuri din mai multe zone.
                </div>
              ) : null}
            </div>
          </Motion.div>
        </div>
      ) : null}
      </AnimatePresence>

      {isAdmin ? (
        <Motion.div className="card p-5 agri-pattern" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 * 0.05 }}>
          <div className="text-xl font-bold">Admin</div>
          <div className="muted text-sm mt-1">Scurtături pentru administrare (global)</div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
              <div>
                <div className="font-semibold">Utilizatori</div>
                <div className="muted text-xs">Roluri • ștergere</div>
              </div>
              <Button variant="primary" onClick={() => nav("/app/admin/users")}>Deschide</Button>
            </div>

            <div className="card-soft p-4 flex items-center justify-between gap-3 transition-shadow hover:shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
              <div>
                <div className="font-semibold">Setări sistem</div>
                <div className="muted text-xs">Senzori • backup</div>
              </div>
              <Button variant="primary" onClick={() => nav("/app/admin/settings")}>Deschide</Button>
            </div>
          </div>
        </Motion.div>
      ) : null}

      <AnimatePresence>
      {pwdOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPwdOpen(false);
          }}
        >
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          <Motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="relative w-full max-w-md card p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-extrabold">Schimbă parola</div>
                <div className="muted text-sm mt-1">Introdu parola curentă și alege o parolă nouă.</div>
              </div>
              <Button type="button" variant="ghost" onClick={() => setPwdOpen(false)} disabled={pwdSaving} title="Închide">
                ✕
              </Button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pwdCurrent">Parola curentă</Label>
                <Input
                  id="pwdCurrent"
                  type="password"
                  value={pwdCurrent}
                  onChange={(e) => setPwdCurrent(e.target.value)}
                  disabled={pwdSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwdNext">Parola nouă</Label>
                <Input
                  id="pwdNext"
                  type="password"
                  value={pwdNext}
                  onChange={(e) => setPwdNext(e.target.value)}
                  disabled={pwdSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwdConfirm">Confirmă parola nouă</Label>
                <Input
                  id="pwdConfirm"
                  type="password"
                  value={pwdConfirm}
                  onChange={(e) => setPwdConfirm(e.target.value)}
                  disabled={pwdSaving}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="ghost" onClick={() => setPwdOpen(false)} disabled={pwdSaving}>
                  Renunță
                </Button>
                <Button type="button" variant="primary" onClick={changePassword} disabled={pwdSaving}>
                  {pwdSaving ? "Se salvează..." : "Salvează"}
                </Button>
              </div>
            </div>
          </Motion.div>
        </div>
      ) : null}
      </AnimatePresence>

      <Motion.div className="card p-5 agri-pattern" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 * 0.05 }}>
        <Button onClick={logout} variant="ghost" fullWidth className="rounded-2xl py-3">
          <LogOut size={18} /> Deconectare
        </Button>
      </Motion.div>
    </div>
  );
}

function ThemePreference() {
  const { theme, toggleTheme } = useTheme();

  const themeLabel = theme === 'light' ? 'Light' : 'Dark';
  const themeDescription = theme === 'light'
    ? 'Interfață luminoasă'
    : 'Interfață întunecată';

  return (
    <div className="mt-4 card-soft p-4 flex items-center justify-between">
      <div>
        <div className="font-semibold">Temă</div>
        <div className="text-sm muted">{themeDescription}</div>
      </div>
      <Motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/15 transition-colors"
      >
        {theme === 'light' ? (
          <>
            <Sun size={18} className="text-primary" />
            <span className="text-sm font-semibold text-primary">{themeLabel}</span>
          </>
        ) : (
          <>
            <Moon size={18} className="text-primary" />
            <span className="text-sm font-semibold text-primary">{themeLabel}</span>
          </>
        )}
      </Motion.button>
    </div>
  );
}