import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{
        background: 'rgba(30, 33, 72, 0.95)',
        border: '1px solid rgba(124,92,252,0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
      }}>
        <p className="text-xs font-medium mb-1" style={{ color: '#8891B4' }}>{label}</p>
        <p className="text-base font-bold" style={{ color: '#9B7DFF' }}>
          R$ {Number(payload[0].value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function GraficoDespesas({ data = [] }) {
  return (
    <div className="rounded-2xl p-6" style={{
      background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
      border: '1px solid rgba(124,92,252,0.12)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 0 60px rgba(124,92,252,0.04)',
    }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.2)' }}>
            <Activity size={16} style={{ color: '#9B7DFF' }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Despesas Mensais</h2>
            <p className="text-xs" style={{ color: '#4A5177' }}>Evolução dos seus gastos</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(124,92,252,0.1)', color: '#9B7DFF', border: '1px solid rgba(124,92,252,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
          Ao vivo
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.4} />
              <stop offset="60%" stopColor="#7C5CFC" stopOpacity={0.1} />
              <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="mes" axisLine={false} tickLine={false}
            tick={{ fill: '#4A5177', fontSize: 12, fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }} dy={8} />
          <YAxis axisLine={false} tickLine={false}
            tick={{ fill: '#4A5177', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
            tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
          <Tooltip content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(124,92,252,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="valor" stroke="#7C5CFC" strokeWidth={2.5}
            fill="url(#purpleGrad)"
            dot={{ fill: '#7C5CFC', r: 4, strokeWidth: 2, stroke: '#1A1D3A' }}
            activeDot={{ fill: '#9B7DFF', r: 6, strokeWidth: 2, stroke: '#1A1D3A' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
