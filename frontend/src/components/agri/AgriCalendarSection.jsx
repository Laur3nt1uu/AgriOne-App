import { useState, useMemo } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Plus, X, ChevronLeft, ChevronRight, ChevronDown, Trash2,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card } from "../../ui/card";
import { authStore } from "../../auth/auth.store";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_SHORT = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
const MONTHS_FULL  = [
  "Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie",
  "Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie",
];

const CROPS = [
  { id: "grau",     name: "Grâu",             emoji: "🌾", plant: [{s:10,e:11}], harvest: [{s:6,e:7}]  },
  { id: "orz",      name: "Orz",              emoji: "🌿", plant: [{s:10,e:11}], harvest: [{s:5,e:6}]  },
  { id: "rapita",   name: "Rapiță",           emoji: "🟡", plant: [{s:8, e:9}],  harvest: [{s:6,e:7}]  },
  { id: "ovaz",     name: "Ovăz",             emoji: "🌱", plant: [{s:3, e:4}],  harvest: [{s:7,e:8}]  },
  { id: "porumb",   name: "Porumb",           emoji: "🌽", plant: [{s:4, e:5}],  harvest: [{s:9,e:10}] },
  { id: "floarea",  name: "Floarea-soarelui", emoji: "🌻", plant: [{s:4, e:4}],  harvest: [{s:9,e:10}] },
  { id: "soia",     name: "Soia",             emoji: "🫘", plant: [{s:4, e:5}],  harvest: [{s:9,e:10}] },
  { id: "cartofi",  name: "Cartofi",          emoji: "🥔", plant: [{s:3, e:4}],  harvest: [{s:8,e:9}]  },
  { id: "sfecla",   name: "Sfeclă de zahăr",  emoji: "🔴", plant: [{s:3, e:4}],  harvest: [{s:9,e:10}] },
  { id: "struguri", name: "Struguri",         emoji: "🍇", plant: [{s:3, e:3}],  harvest: [{s:9,e:10}] },
];

const FERT_ROWS = [
  { id: "pk_toamna",   name: "Fert. P+K (bază toamnă)",   color: "hsl(262 83% 58%)", bars: [{s:9, e:11}] },
  { id: "n_toamna",    name: "Azot toamnă (păioase)",      color: "hsl(217 91% 60%)", bars: [{s:10,e:11}] },
  { id: "n_primavara", name: "Azot primăvară",             color: "hsl(213 94% 68%)", bars: [{s:2, e:4}]  },
  { id: "foliar",      name: "Fertilizare foliară (vară)", color: "hsl(189 94% 43%)", bars: [{s:5, e:7}]  },
];

const EVENT_TYPES = [
  { value: "fert_azot",   label: "Fertilizare azot (N)",  color: "hsl(217 91% 60%)" },
  { value: "fert_pk",     label: "Fertilizare P+K",       color: "hsl(262 83% 58%)" },
  { value: "fert_foliar", label: "Fertilizare foliară",   color: "hsl(189 94% 43%)" },
  { value: "ierbicid",    label: "Ierbicid",              color: "hsl(38 92% 50%)"  },
  { value: "fungicid",    label: "Fungicid",              color: "hsl(142 71% 45%)" },
  { value: "insecticid",  label: "Insecticid",            color: "hsl(0 84% 60%)"   },
  { value: "irigatii",    label: "Irigații",              color: "hsl(199 89% 48%)" },
  { value: "lucrari_sol", label: "Lucrări sol",           color: "hsl(32 81% 29%)"  },
  { value: "semanat",     label: "Semănat",               color: "hsl(142 76% 36%)" },
  { value: "recoltat",    label: "Recoltat",              color: "hsl(24 95% 53%)"  },
  { value: "altele",      label: "Altele",                color: "hsl(220 9% 46%)"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function storageKey(userId) { return `agri_calendar_v1_${userId || "guest"}`; }
function loadEvents(userId) {
  try { const r = localStorage.getItem(storageKey(userId)); return r ? JSON.parse(r) : []; }
  catch { return []; }
}
function saveEvents(userId, events) {
  try { localStorage.setItem(storageKey(userId), JSON.stringify(events)); } catch { /* noop */ }
}
function makeEmptyForm(year) {
  const m = new Date().getMonth() + 1;
  return { title: "", type: "fert_azot", startMonth: m, endMonth: m, year, notes: "" };
}

/** Left + width as % for a bar spanning months s→e (1-indexed). */
function barStyle(s, e) {
  return {
    left:  `${((s - 1) / 12) * 100}%`,
    width: `${Math.max(((e - s + 1) / 12) * 100, 5)}%`,
  };
}

/** Today's position as % through the year, or null if not current year. */
function todayPct(year) {
  const now = new Date();
  if (now.getFullYear() !== year) return null;
  const start = new Date(year, 0, 1);
  const days  = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
  return ((Math.floor((now - start) / 86_400_000) + 1) / days) * 100;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MonthHeader({ currentMonth, currentYear, year }) {
  return (
    <div className="flex">
      {MONTHS_SHORT.map((m, i) => (
        <div
          key={m}
          className={[
            "flex-1 text-center text-[11px] font-semibold py-2 border-l border-border/10 select-none",
            currentYear === year && currentMonth === i
              ? "text-primary bg-primary/[0.08]"
              : "text-muted-foreground",
          ].join(" ")}
        >
          {m}
        </div>
      ))}
    </div>
  );
}

function GridLines({ currentMonth, currentYear, year }) {
  return (
    <div className="absolute inset-0 flex pointer-events-none">
      {MONTHS_SHORT.map((_, i) => (
        <div
          key={i}
          className={[
            "flex-1 h-full border-l border-border/[0.06]",
            currentYear === year && currentMonth === i ? "bg-primary/[0.03]" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function TodayLine({ pct }) {
  if (pct === null) return null;
  return (
    <div
      className="absolute top-0 bottom-0 w-px bg-primary/60 z-20 pointer-events-none"
      style={{ left: `${pct}%` }}
    >
      <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-primary/80" />
    </div>
  );
}

/** A single Gantt bar with optional text label. */
function GanttBar({ s, e, bg, label, onClick, title }) {
  const style = { ...barStyle(s, e), background: bg };
  return (
    <div
      className={[
        "absolute top-1/2 -translate-y-1/2 h-6 rounded-full flex items-center px-2.5 overflow-hidden",
        onClick ? "cursor-pointer hover:brightness-110 transition-all" : "",
      ].join(" ")}
      style={style}
      onClick={onClick}
      title={title}
    >
      {label && (
        <span className="text-[10px] font-semibold text-white/90 truncate leading-none select-none whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
}

/** Section header row. */
function SectionHeader({ icon, title, right, onClick, open }) {
  return (
    <div
      className={[
        "flex items-center gap-2 px-4 py-2 border-t border-b border-border/15 bg-muted/30",
        onClick ? "cursor-pointer select-none hover:bg-muted/50 transition-colors" : "",
      ].join(" ")}
      onClick={onClick}
    >
      <span className="text-sm">{icon}</span>
      <span className="text-xs font-semibold text-foreground/70 flex-1">{title}</span>
      {right}
      {onClick !== undefined && (
        <ChevronDown
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`}
        />
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function AgriCalendarSection() {
  const user   = authStore.getUser();
  const userId = user?.id || user?.sub || "guest";

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed for styling

  const [year,       setYear]       = useState(currentYear);
  const [events,     setEvents]     = useState(() => loadEvents(userId));
  const [showFert,   setShowFert]   = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(() => makeEmptyForm(currentYear));

  const today      = useMemo(() => todayPct(year), [year]);
  const typeMap    = useMemo(() => Object.fromEntries(EVENT_TYPES.map(t => [t.value, t])), []);
  const yearEvents = useMemo(() => events.filter(e => e.year === year), [events, year]);

  function openAdd() {
    setEditId(null);
    setForm(makeEmptyForm(year));
    setModalOpen(true);
  }

  function openEdit(ev) {
    setEditId(ev.id);
    setForm({ title: ev.title, type: ev.type, startMonth: ev.startMonth, endMonth: ev.endMonth, year: ev.year, notes: ev.notes || "" });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    const s = Number(form.startMonth);
    const endM = Math.max(s, Number(form.endMonth));
    let updated;
    if (editId) {
      updated = events.map(ev => ev.id === editId
        ? { ...ev, title: form.title.trim(), type: form.type, startMonth: s, endMonth: endM, notes: form.notes }
        : ev);
    } else {
      updated = [...events, {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: form.title.trim(), type: form.type,
        startMonth: s, endMonth: endM, year: form.year,
        notes: form.notes, createdAt: new Date().toISOString(),
      }];
    }
    setEvents(updated);
    saveEvents(userId, updated);
    setModalOpen(false);
  }

  function deleteEvent(id) {
    const updated = events.filter(ev => ev.id !== id);
    setEvents(updated);
    saveEvents(userId, updated);
  }

  const ROW_H = "h-11";

  return (
    <Card className="p-0 overflow-hidden gap-0">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-sm">Calendar Agricol</div>
            <div className="text-xs text-muted-foreground">Perioade de cultivare, fertilizare și activitățile tale</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/30 overflow-hidden">
            <button onClick={() => setYear(y => y - 1)} className="px-2.5 py-1.5 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground" aria-label="Anul anterior">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-semibold min-w-[4.5rem] text-center select-none">{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="px-2.5 py-1.5 hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground" aria-label="Anul următor">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {year !== currentYear && (
            <button onClick={() => setYear(currentYear)} className="text-xs text-primary hover:underline px-1">Azi</button>
          )}
          <Button variant="primary" onClick={openAdd} className="gap-1.5 h-9 px-3 text-sm">
            <Plus className="w-4 h-4" /> Adaugă
          </Button>
        </div>
      </div>

      {/* ── Gantt table ──────────────────────────────────────────────────── */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px]">

          {/* Sticky month header */}
          <div className="flex sticky top-0 z-30 bg-background border-b border-border/20">
            <div className="w-48 shrink-0 border-r border-border/15 px-4 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Cultură / Activitate
            </div>
            <div className="flex-1">
              <MonthHeader currentMonth={currentMonth} currentYear={currentYear} year={year} />
            </div>
          </div>

          {/* ── Section: Culturi ────────────────────────────────────────── */}
          <div className="flex border-b border-border/20">
            <div className="w-48 shrink-0 border-r border-border/15">
              <SectionHeader icon="🌾" title="Culturi" />
            </div>
            <div className="flex-1">
              <SectionHeader icon="" title="" />
            </div>
          </div>

          <div className="divide-y divide-border/[0.06]">
            {CROPS.map((crop) => (
              <div key={crop.id} className="flex items-center group hover:bg-muted/[0.04] transition-colors">
                {/* Label */}
                <div className="w-48 shrink-0 flex items-center gap-2.5 px-4 border-r border-border/10 py-0">
                  <span className="text-base leading-none">{crop.emoji}</span>
                  <span className="text-xs font-medium text-foreground/80 leading-tight">{crop.name}</span>
                </div>

                {/* Timeline */}
                <div className={`flex-1 relative ${ROW_H}`}>
                  <GridLines currentMonth={currentMonth} currentYear={currentYear} year={year} />

                  {crop.plant.map((p, pi) => (
                    <GanttBar
                      key={`p${pi}`}
                      s={p.s} e={p.e}
                      bg="hsl(142 71% 38% / 0.85)"
                      label={`↓ Semănat`}
                      title={`Semănat: ${MONTHS_FULL[p.s-1]}${p.s !== p.e ? ` – ${MONTHS_FULL[p.e-1]}` : ""}`}
                    />
                  ))}

                  {crop.harvest.map((h, hi) => {
                    // If overlaps with plant bar, offset vertically
                    const overlaps = crop.plant.some(p =>
                      !(h.e < p.s || h.s > p.e)
                    );
                    return (
                      <div
                        key={`h${hi}`}
                        className="absolute h-6 rounded-full flex items-center px-2.5 overflow-hidden"
                        style={{
                          ...barStyle(h.s, h.e),
                          background: "hsl(38 92% 48% / 0.85)",
                          top: overlaps ? "calc(50% + 4px)" : "50%",
                          transform: overlaps ? "translateY(-2px)" : "translateY(-50%)",
                        }}
                        title={`Recoltat: ${MONTHS_FULL[h.s-1]}${h.s !== h.e ? ` – ${MONTHS_FULL[h.e-1]}` : ""}`}
                      >
                        <span className="text-[10px] font-semibold text-white/90 truncate leading-none select-none whitespace-nowrap">
                          ↑ Recoltat
                        </span>
                      </div>
                    );
                  })}

                  <TodayLine pct={today} />
                </div>
              </div>
            ))}
          </div>

          {/* ── Section: Fertilizări (collapsible) ──────────────────────── */}
          <div className="flex border-t border-border/20">
            <div
              className="w-48 shrink-0 flex items-center gap-2 px-4 py-2 border-r border-border/15 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors select-none"
              onClick={() => setShowFert(v => !v)}
            >
              <span className="text-sm">🌿</span>
              <span className="text-xs font-semibold text-foreground/70 flex-1">Fertilizări</span>
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${showFert ? "" : "-rotate-90"}`} />
            </div>
            <div className="flex-1 bg-muted/30 flex items-center px-4 border-b border-border/10">
              <span className="text-[11px] text-muted-foreground">Perioade recomandate</span>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showFert && (
              <Motion.div
                key="fert-rows"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="divide-y divide-border/[0.06]">
                  {FERT_ROWS.map((fr) => (
                    <div key={fr.id} className="flex items-center hover:bg-muted/[0.04] transition-colors">
                      <div className="w-48 shrink-0 flex items-center gap-2.5 px-4 border-r border-border/10">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/10" style={{ background: fr.color }} />
                        <span className="text-[11px] text-foreground/70 leading-tight">{fr.name}</span>
                      </div>
                      <div className={`flex-1 relative ${ROW_H}`}>
                        <GridLines currentMonth={currentMonth} currentYear={currentYear} year={year} />
                        {fr.bars.map((b, bi) => (
                          <div
                            key={bi}
                            className="absolute top-1/2 -translate-y-1/2 h-5 rounded-full flex items-center px-2 overflow-hidden"
                            style={{ ...barStyle(b.s, b.e), background: `color-mix(in srgb, ${fr.color} 55%, transparent)`, border: `1.5px solid color-mix(in srgb, ${fr.color} 40%, transparent)` }}
                            title={fr.name}
                          >
                            <span className="text-[9px] font-semibold truncate leading-none select-none whitespace-nowrap" style={{ color: fr.color }}>
                              {fr.name}
                            </span>
                          </div>
                        ))}
                        <TodayLine pct={today} />
                      </div>
                    </div>
                  ))}
                </div>
              </Motion.div>
            )}
          </AnimatePresence>

          {/* ── Section: Activitățile mele ──────────────────────────────── */}
          <div className="flex border-t border-border/20">
            <div className="w-48 shrink-0 flex items-center gap-2 px-4 py-2 border-r border-border/15 bg-primary/[0.04]">
              <span className="text-sm">📋</span>
              <span className="text-xs font-semibold text-primary/80 flex-1">Activitățile mele</span>
            </div>
            <div className="flex-1 bg-primary/[0.04] flex items-center justify-between px-4 border-b border-border/10">
              <span className="text-[11px] text-muted-foreground">
                {yearEvents.length > 0
                  ? `${yearEvents.length} ${yearEvents.length === 1 ? "activitate" : "activități"} în ${year}`
                  : `Nicio activitate în ${year}`}
              </span>
              <button onClick={openAdd} className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Plus className="w-3 h-3" /> Adaugă
              </button>
            </div>
          </div>

          {yearEvents.length > 0 ? (
            <div className="divide-y divide-border/[0.06]">
              {yearEvents.map((ev) => {
                const t = typeMap[ev.type] || typeMap.altele;
                return (
                  <div key={ev.id} className="flex items-center group hover:bg-muted/[0.04] transition-colors">
                    <div className="w-48 shrink-0 flex items-center gap-2.5 px-4 border-r border-border/10">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.color }} />
                      <div className="min-w-0">
                        <div className="text-xs font-medium truncate text-foreground/80" title={ev.title}>{ev.title}</div>
                        <div className="text-[10px] text-muted-foreground">{t.label}</div>
                      </div>
                    </div>
                    <div className={`flex-1 relative ${ROW_H}`}>
                      <GridLines currentMonth={currentMonth} currentYear={currentYear} year={year} />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-6 rounded-full flex items-center px-2.5 overflow-hidden cursor-pointer hover:brightness-110 transition-all"
                        style={{
                          ...barStyle(ev.startMonth, ev.endMonth),
                          background: `color-mix(in srgb, ${t.color} 25%, transparent)`,
                          border: `1.5px solid color-mix(in srgb, ${t.color} 50%, transparent)`,
                        }}
                        onClick={() => openEdit(ev)}
                        title={`${ev.title}${ev.notes ? " — " + ev.notes : ""} (click pt. editare)`}
                      >
                        <span className="text-[10px] font-semibold truncate leading-none select-none" style={{ color: t.color }}>
                          {ev.title}
                        </span>
                      </div>
                      {/* Delete on hover */}
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 z-10"
                        onClick={() => deleteEvent(ev.id)}
                        title="Șterge"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                      </button>
                      <TodayLine pct={today} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1.5 py-5 text-xs text-muted-foreground border-t border-border/[0.06]">
              Apasă <button className="text-primary hover:underline font-medium" onClick={openAdd}>+ Adaugă</button> pentru a programa fertilizări, tratamente, irigații etc.
            </div>
          )}

        </div>
      </div>

      {/* ── Legend ───────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3 border-t border-border/20 bg-muted/10">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-6 h-3 rounded-full inline-block" style={{ background: "hsl(142 71% 38% / 0.85)" }} />
          Semănat
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-6 h-3 rounded-full inline-block" style={{ background: "hsl(38 92% 48% / 0.85)" }} />
          Recoltat
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-6 h-3 rounded-full inline-block" style={{ background: "hsl(262 83% 58% / 0.5)" }} />
          Fertilizare recomandată
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-6 h-3 rounded-full inline-block bg-primary/40" />
          Activitate proprie
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-px h-4 bg-primary/60 inline-block rounded" />
          Azi
        </span>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <Motion.div
            key="cal-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setModalOpen(false)} />

            <Motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full max-w-md"
            >
              <Card className="p-6 gap-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{editId ? "Editează activitate" : "Adaugă activitate"}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Programat pentru {form.year}</div>
                  </div>
                  <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setModalOpen(false)} aria-label="Închide">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4 mt-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="cal-title">Titlu *</Label>
                    <Input id="cal-title" placeholder="ex: Fertilizare porumb, câmp 2" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cal-type">Tip activitate</Label>
                    <div className="relative">
                      <select
                        id="cal-type"
                        className="w-full appearance-none rounded-lg border border-border/30 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 pr-8 cursor-pointer"
                        value={form.type}
                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      >
                        {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: typeMap[form.type]?.color }} />
                      <span className="text-xs text-muted-foreground">{typeMap[form.type]?.label}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="cal-start">Lună început</Label>
                      <select id="cal-start" className="w-full appearance-none rounded-lg border border-border/30 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer" value={form.startMonth} onChange={e => setForm(f => ({ ...f, startMonth: Number(e.target.value) }))}>
                        {MONTHS_FULL.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cal-end">Lună sfârșit</Label>
                      <select id="cal-end" className="w-full appearance-none rounded-lg border border-border/30 bg-background/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer" value={form.endMonth} onChange={e => setForm(f => ({ ...f, endMonth: Number(e.target.value) }))}>
                        {MONTHS_FULL.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cal-notes">Note (opțional)</Label>
                    <Input id="cal-notes" placeholder="ex: Doză 150 kg/ha, câmp 2" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5">
                  {editId ? (
                    <Button variant="ghost" onClick={() => { deleteEvent(editId); setModalOpen(false); }} className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" /> Șterge
                    </Button>
                  ) : <span />}
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => setModalOpen(false)}>Anulează</Button>
                    <Button variant="primary" onClick={handleSave} disabled={!form.title.trim()}>
                      {editId ? "Salvează" : "Adaugă"}
                    </Button>
                  </div>
                </div>
              </Card>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}