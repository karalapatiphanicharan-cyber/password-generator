import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';

const STRENGTH_COLORS = {
  weak: '#f87171',
  medium: '#fbbf24',
  strong: '#4ade80',
  'very-strong': '#22d3ee',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-sm border border-white/10">
      <p className="text-white font-medium">{payload[0].name}</p>
      <p className="text-primary-400">{payload[0].value} passwords</p>
    </div>
  );
};

export function StrengthPieChart({ data }) {
  const chartData = Object.entries(data || {}).map(([key, val]) => ({
    name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: val,
    color: STRENGTH_COLORS[key] || '#94a3b8',
  })).filter(d => d.value > 0);

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-48 text-white/30 text-sm">
        No data yet — generate some passwords!
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry, i) => (
            <Cell key={i} fill={entry.color} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ActivityBarChart({ data }) {
  if (!data?.length) {
    return (
      <div className="flex items-center justify-center h-48 text-white/30 text-sm">
        No recent activity found.
      </div>
    );
  }

  const chartData = data.map(d => ({
    date: d._id?.slice(5), // Show MM-DD
    count: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip
          contentStyle={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
          labelStyle={{ color: '#e2e8f0' }}
          itemStyle={{ color: '#5c7cfa' }}
        />
        <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Passwords" />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c7cfa" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#7950f2" stopOpacity={0.6} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
