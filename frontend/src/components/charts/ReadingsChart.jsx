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
  return (
    <div className="card p-3 text-sm">
      <div className="font-bold">{fmtTime(label)}</div>
      <div className="muted mt-1">
        Temp.: <span className="text-foreground font-semibold">{payload.find(p=>p.dataKey==="temperature")?.value ?? "—"}°C</span>
        {" • "}
        Umid.: <span className="text-foreground font-semibold">{payload.find(p=>p.dataKey==="humidity")?.value ?? "—"}%</span>
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
  const colors = useMemo(() => {
    return {
      tempStroke: rgbaFromCssVar("--primary", 0.95, "rgba(0,0,0,0.85)"),
      humStroke: rgbaFromCssVar("--accent", 0.95, "rgba(0,0,0,0.55)"),
      axisStroke: rgbaFromCssVar("--foreground", 0.35, "rgba(0,0,0,0.35)"),
      gridStroke: rgbaFromCssVar("--border", 0.10, "rgba(0,0,0,0.08)"),
    };
  }, []);

  return (
    <div className="card-soft p-4 h-[340px]">
      <div className="text-sm font-bold mb-3">Grafic citiri</div>
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
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}