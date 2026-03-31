import { useState } from 'react';
import { Plus, X, TrendingUp, TrendingDown, Loader2, Tag, ChevronDown } from 'lucide-react';
import { expenseAPI, incomeAPI, categoryAPI } from '../services/api';

export default function BotaoNovaTransacao({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('transacao');

  const [tipo, setTipo] = useState('saida');
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);

  const [catName, setCatName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const openModal = async () => {
    setOpen(true);
    setError('');
    setSuccess('');
    setTab('transacao');
    await loadCategories();
  };

  const loadCategories = async () => {
    try {
      const cats = await categoryAPI.list();
      setCategories(cats || []);
    } catch { setCategories([]); }
  };

  const close = () => {
    setOpen(false);
    setDesc(''); setValor(''); setCategoryId(''); setCatName('');
    setError(''); setSuccess('');
  };

  const submitTransacao = async () => {
    if (!desc.trim() || !valor) { setError('Preencha todos os campos.'); return; }
    const amount = parseFloat(valor.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) { setError('Valor inválido.'); return; }
    if (tipo === 'saida' && !categoryId) { setError('Selecione uma categoria.'); return; }

    setLoading(true); setError('');
    try {
      if (tipo === 'saida') await expenseAPI.create(desc, amount, Number(categoryId));
      else await incomeAPI.create(desc, amount);
      close();
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Erro ao salvar transação.');
    } finally { setLoading(false); }
  };

  const submitCategoria = async () => {
    if (!catName.trim()) { setError('Digite um nome para a categoria.'); return; }
    setLoading(true); setError(''); setSuccess('');
    try {
      await categoryAPI.create(catName.trim());
      setCatName('');
      setSuccess(`Categoria "${catName}" criada!`);
      await loadCategories();
    } catch (err) {
      setError(err.message || 'Você já tem uma categoria com esse nome!');
    } finally { setLoading(false); }
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={close}
        >
          <div
            className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl p-6 relative"
            style={{
              background: 'linear-gradient(145deg, #1E2148, #13162B)',
              border: '1px solid rgba(124,92,252,0.25)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Handle bar for mobile */}
            <div className="w-10 h-1 rounded-full mx-auto mb-4 sm:hidden" style={{ background: 'rgba(255,255,255,0.15)' }} />

            <button onClick={close}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg flex items-center justify-center hover:scale-110 transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#8891B4' }}>
              <X size={15} />
            </button>

            <h3 className="text-lg font-bold text-white mb-5">Nova Transação</h3>

            <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
              {[
                { key: 'transacao', label: 'Transação', icon: <TrendingUp size={13} /> },
                { key: 'categoria', label: 'Categoria', icon: <Tag size={13} /> },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => { setTab(key); setError(''); setSuccess(''); }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: tab === key ? 'linear-gradient(135deg, #7C5CFC, #5B8AF5)' : 'transparent',
                    color: tab === key ? '#fff' : '#4A5177',
                    boxShadow: tab === key ? '0 4px 12px rgba(124,92,252,0.35)' : 'none',
                  }}>
                  {icon}{label}
                </button>
              ))}
            </div>

            {tab === 'transacao' && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
                  {['entrada', 'saida'].map(t => (
                    <button key={t} onClick={() => setTipo(t)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                      style={{
                        background: tipo === t ? (t === 'entrada' ? 'rgba(34,197,94,0.2)' : 'rgba(244,63,94,0.2)') : 'transparent',
                        color: tipo === t ? (t === 'entrada' ? '#22C55E' : '#F43F5E') : '#4A5177',
                        border: tipo === t ? `1px solid ${t === 'entrada' ? 'rgba(34,197,94,0.3)' : 'rgba(244,63,94,0.3)'}` : '1px solid transparent',
                      }}>
                      {t === 'entrada' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {t === 'entrada' ? 'Entrada' : 'Saída'}
                    </button>
                  ))}
                </div>

                <InputField label="Descrição" placeholder="Ex: Salário, Netflix..." value={desc} onChange={e => setDesc(e.target.value)} />
                <InputField label="Valor (R$)" placeholder="0,00" type="number" value={valor} onChange={e => setValor(e.target.value)} />

                {tipo === 'saida' && (
                  <div>
                    <label className="block text-xs font-semibold mb-2" style={{ color: '#8891B4' }}>Categoria</label>
                    <div className="relative">
                      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                        className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none transition-all"
                        style={{
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: categoryId ? '#EDF0FF' : '#4A5177',
                        }}>
                        <option value="">Selecione uma categoria</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4A5177' }} />
                    </div>
                    {categories.length === 0 && (
                      <p className="text-xs mt-1.5 cursor-pointer hover:underline" style={{ color: '#9B7DFF' }}
                        onClick={() => setTab('categoria')}>
                        + Criar primeira categoria
                      </p>
                    )}
                  </div>
                )}

                {error && <ErrorMsg msg={error} />}

                <button onClick={submitTransacao} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 4px 20px rgba(124,92,252,0.4)' }}>
                  {loading && <Loader2 size={15} className="animate-spin" />}
                  Adicionar Transação
                </button>
              </div>
            )}

            {tab === 'categoria' && (
              <div className="flex flex-col gap-4">
                <InputField
                  label="Nome da categoria"
                  placeholder="Ex: Alimentação, Lazer, Saúde..."
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitCategoria()}
                />

                {categories.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold mb-2" style={{ color: '#8891B4' }}>
                      Categorias existentes ({categories.length})
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
                      {categories.map(c => (
                        <span key={c.id} className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: 'rgba(124,92,252,0.12)', color: '#9B7DFF', border: '1px solid rgba(124,92,252,0.2)' }}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {error && <ErrorMsg msg={error} />}
                {success && (
                  <div className="text-xs px-3 py-2.5 rounded-xl font-medium"
                    style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                    ✓ {success}
                  </div>
                )}

                <button onClick={submitCategoria} disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 4px 20px rgba(124,92,252,0.4)' }}>
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  Criar Categoria
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <button onClick={openModal}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-white text-sm transition-all duration-300 hover:scale-105 active:scale-95"
        style={{ background: 'linear-gradient(135deg, #7C5CFC 0%, #5B8AF5 100%)', boxShadow: '0 8px 32px rgba(124,92,252,0.45)' }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Plus size={14} strokeWidth={2.5} />
        </div>
        <span className="hidden sm:inline">Nova Transação</span>
        <span className="sm:hidden">Nova</span>
      </button>
    </>
  );
}

function InputField({ label, placeholder, value, onChange, type = 'text', onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-2" style={{ color: '#8891B4' }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${focused ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.07)'}`,
          color: '#EDF0FF',
        }}
      />
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div className="text-xs px-3 py-2.5 rounded-xl font-medium"
      style={{ background: 'rgba(244,63,94,0.12)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.2)' }}>
      {msg}
    </div>
  );
}
