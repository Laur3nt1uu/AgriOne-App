import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
        Temp.: <span className="text-slate-900 font-semibold">{payload.find(p=>p.dataKey==="temperature")?.value ?? "—"}°C</span>
        {" • "}
        Umid.: <span className="text-slate-900 font-semibold">{payload.find(p=>p.dataKey==="humidity")?.value ?? "—"}%</span>
      </div>
    </div>
  );
}

export default function ReadingsChart({ data }) {
  const tempStroke = "hsl(var(--chart-1))";
  const humStroke = "hsl(var(--chart-2))";
  const axisStroke = "rgba(15,23,42,0.35)";
  const gridStroke = "rgba(15,23,42,0.08)";

  return (
    <div className="card-soft p-4 h-[340px]">
      <div className="text-sm font-bold mb-3">Grafic citiri</div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridStroke} />
          <XAxis
            dataKey="ts"
            tickFormatter={(v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            stroke={axisStroke}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke={axisStroke} tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke={tempStroke}
            strokeWidth={2.5}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke={humStroke}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}