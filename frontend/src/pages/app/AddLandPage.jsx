import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/endpoints";
import { toastError, toastSuccess } from "../../utils/toast";
import { Button } from "../../ui/button";
import GooglePolygonDrawMap from "../../components/maps/GooglePolygonDrawMap";
import { Badge } from "../../ui/badge";
import { CheckCircle2, Edit3, Map as MapIcon, Sprout } from "lucide-react";
import { authStore } from "../../auth/auth.store";
import {
  centroidFromLatLngPairs,
  polygonAreaHa,
  toGeoJsonPolygonFromLatLngPairs,
  validateLatLngPairs,
} from "../../utils/geometry";

const RO_CENTER = [45.9432, 24.9668];

export default function AddLandPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const user = authStore.getUser();
  const isAdmin = user?.role === "ADMIN";

  const ownerIdFromUrl = params.get("ownerId") || "";

  const [users, setUsers] = useState([]);
  const [ownerSearch, setOwnerSearch] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [step, setStep] = useState(1); // 1=form, 2=map
  const [name, setName] = useState("");
  const [cropType, setCropType] = useState("Wheat");

  const [polygon, setPolygon] = useState(null);
  const [areaHa, setAreaHa] = useState(0);

  const [busy, setBusy] = useState(false);

  const center = useMemo(() => RO_CENTER, []);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const data = await api.admin.listUsers();
        const arr = Array.isArray(data) ? data : (data?.users || []);
        const displayName = (u) => {
          const username = u?.username ? String(u.username) : "";
          if (username) return username;
          const email = u?.email ? String(u.email) : "";
          return email ? email.split("@")[0] : "";
        };
        const sorted = arr
          .slice()
          .sort((a, b) => displayName(a).localeCompare(displayName(b)) || String(a.email || "").localeCompare(String(b.email || "")));
        setUsers(sorted);

        if (ownerIdFromUrl) {
          const exists = sorted.some((u) => String(u.id) === String(ownerIdFromUrl));
          if (exists) setOwnerId(String(ownerIdFromUrl));
        }
      } catch {
        setUsers([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    if (!isAdmin) return [];
    const q = ownerSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const email = String(u.email || "").toLowerCase();
      const username = String(u.username || "").toLowerCase();
      const emailPrefix = email ? email.split("@")[0] : "";
      return email.includes(q) || username.includes(q) || emailPrefix.includes(q);
    });
  }, [isAdmin, ownerSearch, users]);

  function validateStep1() {
    if (!name.trim()) return "Completează numele terenului.";
    if (!cropType.trim()) return "Alege cultura.";
    return "";
  }

  function goNext() {
    const m = validateStep1();
    if (m) {
      toast.error(m);
      return;
    }
    setStep(2);
    // scroll top nice
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePolygonChange(pts) {
    if (!pts || !pts.length) {
      setPolygon(null);
      setAreaHa(0);
      return;
    }
    setPolygon(pts);
    setAreaHa(polygonAreaHa(pts));
  }

  async function onSave() {
    const m = validateStep1();
    if (m) {
      toast.error(m);
      setStep(1);
      return;
    }

    const v = validateLatLngPairs(polygon, { maxPoints: 2000 });
    if (!v.ok) {
      toast.error(v.message || "Desenează mai întâi poligonul (terenul) pe hartă.");
      return;
    }

    const c = centroidFromLatLngPairs(polygon);
    const geometry = toGeoJsonPolygonFromLatLngPairs(polygon);

    const payload = {
      name: name.trim(),
      cropType: cropType.trim(),
      areaHa: Number(areaHa || 0),
      centroid: c ? { lat: c.lat, lng: c.lng } : null,
      geometry,
    };

    if (isAdmin && ownerId) payload.ownerId = ownerId;

    setBusy(true);
    try {
      const created = await api.lands.create(payload);
      const newId = created?.id || created?.landId || created?.uuid || created?.data?.id;
      toastSuccess("Terenul a fost salvat.");
      if (newId) nav(`/lands/${newId}`);
      else nav("/lands");
    } catch (e) {
      toastError(e, "Nu pot salva terenul.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="card p-6 agri-pattern flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <div className="text-2xl font-extrabold">Adaugă teren</div>
          <div className="muted text-sm">
            Pasul {step} din 2 • {step === 1 ? "Detalii" : "Desenează limita"}
          </div>
          {isAdmin ? (
            <div className="muted text-xs mt-1">Notă: poți crea terenul fie pe contul tău ADMIN, fie pentru un utilizator selectat.</div>
          ) : null}
          <div className="mt-3 flex gap-2 flex-wrap">
            <Badge as="div" variant={step === 1 ? "success" : "default"}>
              <Edit3 size={14} className="text-muted-foreground" /> 1. Detalii
            </Badge>
            <Badge as="div" variant={step === 2 ? "success" : "default"}>
              <MapIcon size={14} className="text-muted-foreground" /> 2. Hartă
            </Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => nav("/lands")} variant="ghost">
            Anulează
          </Button>

          {step === 1 ? (
            <Button onClick={goNext} variant="primary">
              Următorul: desenează pe hartă →
            </Button>
          ) : (
            <>
              <Button onClick={goBack} variant="ghost">
                ← Înapoi
              </Button>
              <Button disabled={busy} onClick={onSave} variant="primary">
                {busy ? "Se salvează..." : "Salvează terenul"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* STEP 1: FORM */}
      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 max-w-3xl mx-auto w-full">
          <div className="card p-5 space-y-4 agri-pattern">
            <div className="text-lg font-bold">Detalii teren</div>

            {isAdmin ? (
              <div className="card-soft p-4 space-y-3">
                <div>
                  <div className="text-sm font-bold">Owner (utilizator)</div>
                  <div className="muted text-sm mt-1">Alege utilizatorul pentru care creezi terenul.</div>
                </div>

                <div>
                  <div className="text-xs muted mb-1">Caută după username sau email</div>
                  <input
                    className="input"
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                    placeholder="ex: ion.popescu sau ion.popescu@..."
                  />
                </div>

                <div>
                  <div className="text-xs muted mb-1">Selectează utilizator</div>
                  <select
                    className="input"
                    value={ownerId}
                    onChange={(e) => setOwnerId(e.target.value)}
                  >
                    <option value="">— alege utilizator —</option>
                    {filteredUsers.slice(0, 200).map((u) => (
                      <option key={u.id} value={u.id}>
                        {(u.username || (u.email ? String(u.email).split("@")[0] : ""))} ({u.role}){u.email ? ` • ${u.email}` : ""}
                      </option>
                    ))}
                  </select>
                  {users.length > 200 ? (
                    <div className="muted text-xs mt-1">Se afișează primele 200 rezultate (filtrează după username/email).</div>
                  ) : null}
                </div>

                {!ownerId ? (
                  <div className="muted text-xs">Notă: dacă nu alegi owner, terenul se creează pe contul admin.</div>
                ) : null}
              </div>
            ) : null}

            <div>
              <div className="text-xs muted mb-1">Nume teren</div>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Parcela A - Hoceni"
              />
            </div>

            <div>
              <div className="text-xs muted mb-1">Cultură</div>
              <select
                className="input"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
              >
                <option>Grâu</option>
                <option>Porumb</option>
                <option>Floarea-soarelui</option>
                <option>Rapiță</option>
                <option>Orz</option>
                <option>Cartof</option>
                <option>Legume</option>
                <option>Altele</option>
              </select>
            </div>

            <div className="card-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold">Pasul următor</div>
                <span className="icon-chip w-10 h-10 rounded-2xl" title="Agricultură">
                  <Sprout size={18} className="text-muted-foreground" />
                </span>
              </div>
              <div className="mt-2 text-sm muted">
                După ce completezi detaliile, vei desena limita terenului (poligon) pe hartă.
              </div>
            </div>

            <Button onClick={goNext} variant="primary" fullWidth>
              Următorul: desenează pe hartă →
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: MAP */}
      {step === 2 && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
          {/* Map */}
          <div className="card p-3 h-[560px] md:h-[720px]">
            <GooglePolygonDrawMap
              center={center}
              zoom={7}
              value={polygon}
              onChange={handlePolygonChange}
              height="100%"
            />
          </div>

          {/* Summary */}
          <div className="card p-5 space-y-4 agri-pattern">
            <div className="text-lg font-bold">Sumar</div>

            <div className="card-soft p-4">
              <div className="text-xs muted">Teren</div>
              <div className="font-semibold">{name || "-"}</div>

              <div className="mt-3 text-xs muted">Cultură</div>
              <div className="font-semibold">{cropType || "-"}</div>
            </div>

            <div className="card-soft p-4">
              <div className="text-sm font-semibold">Limită</div>
              <div className="mt-2 text-sm muted">
                {polygon ? (
                  <>
                    Puncte: <span className="text-foreground font-semibold">{polygon.length}</span>
                    <br />
                    Suprafață:{" "}
                    <span className="text-primary font-extrabold">
                      {areaHa ? areaHa.toFixed(2) : "0.00"} ha
                    </span>
                  </>
                ) : (
                  "Încă nu este desenată. Folosește unealta de desen din hartă."
                )}
              </div>
            </div>

            <div className="text-xs muted leading-relaxed">
              Sfaturi: click pentru a adăuga puncte, dublu-click pentru finalizare. Poți edita poligonul ulterior.
            </div>

            <Button disabled={busy} onClick={onSave} variant="primary" fullWidth>
              {busy ? "Se salvează..." : "Salvează terenul"}
            </Button>

            {polygon?.length ? (
              <div className="card-soft p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Validare</div>
                  <div className="muted text-xs mt-1">Poligon desenat, gata de salvare</div>
                </div>
                <span className="icon-chip" title="OK">
                  <CheckCircle2 size={18} className="text-muted-foreground" />
                </span>
              </div>
            ) : null}

            <Button onClick={goBack} variant="ghost" fullWidth>
              ← Înapoi la detalii
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}