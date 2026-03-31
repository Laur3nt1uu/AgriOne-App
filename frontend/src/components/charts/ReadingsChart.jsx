import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const soil = payload.find(p=>p.dataKey==="soilMoisture");
  return (
    <div className="card p-3 text-sm">
      <div className="font-bold">{fmtTime(label)}</div>
      <div className="muted mt-1 space-y-0.5">
        <div>Temp.: <span className="text-foreground font-semibold">{payload.find(p=>p.dataKey==="temperature")?.value ?? "—"}°C</span></div>
        <div>Umid. Aer: <span className="text-foreground font-semibold">{payload.find(p=>p.dataKey==="humidity")?.value ?? "—"}%</span></div>
        {soil?.value != null && (
          <div>Umid. Sol: <span className="text-foreground font-semibold">{soil.value}%</span></div>
        )}
      </div>
    </div>
  );
}

function parseRgbTriplet(value) {
  const parts = String(value || "")
    .replace(/,/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((n) => Number(n));
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  return parts;
}

function rgbaFromCssVar(varName, alpha, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName);
  const rgb = parseRgbTriplet(raw);
  if (!rgb) return fallback;
  const [r, g, b] = rgb;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ReadingsChart({ data }) {
  const hasSoil = useMemo(() => data?.some(d => d.soilMoisture != null), [data]);

  const colors = useMemo(() => {
    return {
      tempStroke: rgbaFromCssVar("--primary", 0.95, "rgba(0,0,0,0.85)"),
      humStroke: rgbaFromCssVar("--accent", 0.95, "rgba(0,0,0,0.55)"),
      soilStroke: "rgba(16, 185, 129, 0.85)", // emerald-500
      axisStroke: rgbaFromCssVar("--foreground", 0.35, "rgba(0,0,0,0.35)"),
      gridStroke: rgbaFromCssVar("--border", 0.10, "rgba(0,0,0,0.08)"),
    };
  }, []);

  return (
    <div className="card-soft p-4 h-[340px]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold">Grafic citiri</div>
        <div className="flex items-center gap-3 text-xs muted">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 rounded" style={{background: colors.tempStroke}} />Temp.</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 rounded" style={{background: colors.humStroke}} />Umid. Aer</span>
          {hasSoil && <span className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 rounded" style={{background: colors.soilStroke}} />Umid. Sol</span>}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={colors.gridStroke} />
          <XAxis
            dataKey="ts"
            tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            stroke={colors.axisStroke}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke={colors.axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={colors.tempStroke}
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke={colors.humStroke}
            strokeWidth={2}
            dot={false}
          />
          {hasSoil && (
            <Line
              type="monotone"
              dataKey="soilMoisture"
              stroke={colors.soilStroke}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}