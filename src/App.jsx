import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import CardResumo from './components/CardResumo';
import GraficoDespesas from './components/GraficoDespesas';
import ListaTransacoes from './components/ListaTransacoes';
import BotaoNovaTransacao from './components/BotaoNovaTransacao';
import LoginPage from './pages/LoginPage';
import { dashboardAPI, expenseAPI, incomeAPI } from './services/api';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [dash, expenses, incomes] = await Promise.all([
        dashboardAPI.get(),
        expenseAPI.list(),
        incomeAPI.list(),
      ]);
      setDashboard(dash);

      const all = [
        ...(expenses || []).map(e => ({ ...e, type: 'EXPENSE' })),
        ...(incomes || []).map(i => ({ ...i, type: 'INCOME' })),
      ].sort((a, b) => new Date(b.dateTime || 0) - new Date(a.dateTime || 0));

      setTransacoes(all.slice(0, 10));
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0F1C' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#9B7DFF' }} />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  // Build chart data from transactions
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const expensesForChart = transacoes.filter(t => t.type === 'EXPENSE');
  const chartDataMap = {};
  expensesForChart.forEach(t => {
    if (t.dateTime) {
      const m = new Date(t.dateTime).getMonth();
      chartDataMap[m] = (chartDataMap[m] || 0) + Number(t.amount);
    }
  });
  const chartData = Object.entries(chartDataMap).map(([m, v]) => ({
    mes: monthNames[Number(m)], valor: v
  }));
  const finalChartData = chartData.length > 0 ? chartData : [
    { mes: 'Jan', valor: 1200 }, { mes: 'Fev', valor: 2500 },
    { mes: 'Mar', valor: 5000 }, { mes: 'Abr', valor: 4000 },
    { mes: 'Mai', valor: 6000 }, { mes: 'Jun', valor: 4800 },
  ];

  // Category data from backend: expensesByCategory = [{ categoryName, total }]
  const expTotal = Number(dashboard?.totalExpense || 0);
  const catColors = ['#F59E0B', '#7C5CFC', '#22C55E', '#F43F5E', '#8891B4'];
  const catEntries = (dashboard?.expensesByCategory || [])
    .slice(0, 5)
    .map(c => [c.categoryName, Number(c.total)]);

  return (
    <div className="min-h-screen" style={{ background: '#0D0F1C' }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 80% 50% at 20% -10%, rgba(124,92,252,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse 60% 40% at 80% 100%, rgba(91,138,245,0.06) 0%, transparent 60%)`,
      }} />

      <Header />

      {dataLoading && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium"
          style={{ background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)', color: '#9B7DFF' }}>
          <Loader2 size={13} className="animate-spin" />
          Sincronizando...
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
        <CardResumo data={dashboard} />
        <GraficoDespesas data={finalChartData} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <ListaTransacoes transacoes={transacoes} onRefresh={fetchData} />
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Saldo card */}
            <div className="rounded-2xl p-5" style={{
              background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
              border: '1px solid rgba(124,92,252,0.12)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}>
              <p className="text-xs font-semibold mb-1" style={{ color: '#8891B4' }}>Saldo Disponível</p>
              <p className="text-2xl font-bold text-white mb-4">
                R$ {Number(dashboard?.balance || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <div className="relative h-2 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="absolute inset-y-0 left-0 rounded-full" style={{
                  width: `${Math.min(100, (Number(dashboard?.balance || 0) / Math.max(Number(dashboard?.totalIncome || 1), 1)) * 100).toFixed(1)}%`,
                  background: 'linear-gradient(90deg, #7C5CFC, #5B8AF5)',
                  boxShadow: '0 0 8px rgba(124,92,252,0.5)',
                }} />
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: '#9B7DFF' }} className="font-semibold">
                  {((Number(dashboard?.balance || 0) / Math.max(Number(dashboard?.totalIncome || 1), 1)) * 100).toFixed(1)}% das entradas
                </span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="rounded-2xl p-5" style={{
              background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
              border: '1px solid rgba(124,92,252,0.1)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}>
              <p className="text-sm font-bold text-text-primary mb-4">Gastos por Categoria</p>
              {catEntries.length > 0 ? catEntries.map(([cat, val], i) => {
                const pct = expTotal > 0 ? Math.round((val / expTotal) * 100) : 0;
                return (
                  <div key={cat} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: '#8891B4' }} className="font-medium">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#6B7280' }} className="font-medium">
                          R$ {val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span style={{ color: catColors[i % catColors.length] }} className="font-semibold">{pct}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{
                        width: `${pct}%`,
                        background: catColors[i % catColors.length],
                        opacity: 0.85,
                      }} />
                    </div>
                  </div>
                );
              }) : (
                <p className="text-xs" style={{ color: '#4A5177' }}>Nenhuma despesa cadastrada.</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <BotaoNovaTransacao onSuccess={fetchData} />
    </div>
  );
}
