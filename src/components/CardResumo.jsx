import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

function formatBRL(value) {
  return Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function Card({ icon, label, value, type }) {
  const isEntrada = type === 'entrada';
  const isSaida = type === 'saida';
  const valueColor = isEntrada ? '#22C55E' : isSaida ? '#F43F5E' : '#EDF0FF';
  const iconBg = isEntrada ? 'rgba(34,197,94,0.15)' : isSaida ? 'rgba(244,63,94,0.15)' : 'rgba(124,92,252,0.15)';
  const borderColor = isEntrada ? 'rgba(34,197,94,0.12)' : isSaida ? 'rgba(244,63,94,0.12)' : 'rgba(124,92,252,0.15)';
  const glowColor = isEntrada ? 'rgba(34,197,94,0.06)' : isSaida ? 'rgba(244,63,94,0.06)' : 'rgba(124,92,252,0.08)';

  return (
    <div className="card-shine flex-1 rounded-2xl p-6"
      style={{
        background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
        border: `1px solid ${borderColor}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 0 60px ${glowColor}`,
      }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, border: `1px solid ${borderColor}` }}>
          {icon}
        </div>
        <p className="text-sm font-semibold" style={{ color: '#8891B4' }}>{label}</p>
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: '#4A5177' }}>R$</p>
        <p className="text-3xl font-bold tracking-tight" style={{ color: valueColor }}>
          {formatBRL(value)}
        </p>
      </div>
      <div className="mt-4 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div className="h-full rounded-full" style={{
          width: isSaida ? '34%' : isEntrada ? '100%' : '65%',
          background: isEntrada ? 'linear-gradient(90deg, #22C55E, #16A34A)' : isSaida ? 'linear-gradient(90deg, #F43F5E, #E11D48)' : 'linear-gradient(90deg, #7C5CFC, #5B8AF5)',
        }} />
      </div>
    </div>
  );
}

export default function CardResumo({ data }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Card icon={<Coins size={18} color="#F59E0B" />} label="Saldo Total" value={data?.balance} type="saldo" />
      <Card icon={<TrendingUp size={18} color="#22C55E" />} label="Entradas" value={data?.totalIncome} type="entrada" />
      <Card icon={<TrendingDown size={18} color="#F43F5E" />} label="Saídas" value={data?.totalExpense} type="saida" />
    </div>
  );
}
