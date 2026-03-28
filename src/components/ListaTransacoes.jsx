import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Clock, Trash2, Loader2 } from 'lucide-react';
import { expenseAPI, incomeAPI } from '../services/api';

function formatBRL(value) {
  return Math.abs(Number(value || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function formatDate(dt) {
  if (!dt) return 'Hoje';
  return new Date(dt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

function TransacaoItem({ transacao, onDelete }) {
  const isEntrada = transacao.type === 'INCOME';
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (isEntrada) await incomeAPI.delete(transacao.id);
      else await expenseAPI.delete(transacao.id);
      onDelete();
    } catch {
      setDeleting(false);
    }
  };

  const iconeMap = {
    Salário: '💼', Mercado: '🛒', Netflix: '🎬', Academia: '🏋️',
    Freelance: '💻', Aluguel: '🏠', Energia: '⚡', Alimentação: '🍽️',
  };
  const icone = iconeMap[transacao.description] || (isEntrada ? '💰' : '💸');

  return (
    <div
      className="group flex items-center justify-between py-4 px-5 rounded-xl transition-all duration-200 cursor-pointer"
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{
            background: isEntrada ? 'rgba(34,197,94,0.12)' : 'rgba(244,63,94,0.1)',
            border: `1px solid ${isEntrada ? 'rgba(34,197,94,0.2)' : 'rgba(244,63,94,0.18)'}`,
          }}>
          {icone}
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{transacao.description}</p>
          <p className="text-xs mt-0.5" style={{ color: '#4A5177' }}>
            {isEntrada ? 'Crédito' : 'Débito'} · {formatDate(transacao.dateTime)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-bold" style={{ color: isEntrada ? '#22C55E' : '#F43F5E' }}>
          {isEntrada ? '+' : '-'} R$ {formatBRL(transacao.amount)}
        </p>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: isEntrada ? 'rgba(34,197,94,0.15)' : 'rgba(244,63,94,0.13)',
            color: isEntrada ? '#22C55E' : '#F43F5E',
            border: `1px solid ${isEntrada ? 'rgba(34,197,94,0.25)' : 'rgba(244,63,94,0.22)'}`,
            minWidth: '80px', justifyContent: 'center',
          }}>
          {isEntrada ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
          {isEntrada ? 'Entrada' : 'Saída'}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110"
          style={{ background: 'rgba(244,63,94,0.12)', color: '#F43F5E' }}
        >
          {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function ListaTransacoes({ transacoes = [], onRefresh }) {
  return (
    <div className="rounded-2xl p-6" style={{
      background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
      border: '1px solid rgba(124,92,252,0.1)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.2)' }}>
            <Clock size={16} style={{ color: '#9B7DFF' }} />
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary">Últimas Transações</h2>
            <p className="text-xs" style={{ color: '#4A5177' }}>{transacoes.length} transações recentes</p>
          </div>
        </div>
      </div>

      <div className="my-4 h-px" style={{ background: 'rgba(255,255,255,0.04)' }} />

      {transacoes.length === 0 ? (
        <div className="py-10 text-center" style={{ color: '#4A5177' }}>
          <p className="text-2xl mb-2">💸</p>
          <p className="text-sm">Nenhuma transação ainda</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {transacoes.map((t) => (
            <TransacaoItem key={`${t.type}-${t.id || t.description}`} transacao={t} onDelete={onRefresh} />
          ))}
        </div>
      )}
    </div>
  );
}
