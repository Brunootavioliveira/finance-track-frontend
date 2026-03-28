import { Wallet, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const initials = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 sticky top-0 z-30"
      style={{ background: 'linear-gradient(90deg, #0D0F1C 0%, #13162B 100%)' }}>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 0 20px rgba(124,92,252,0.3)' }}>
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Finance<span style={{ color: '#9B7DFF' }}>Track</span>
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105"
          style={{ background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)' }}>
          <Bell size={16} style={{ color: '#9B7DFF' }} />
        </button>

        <div className="h-8 w-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-text-primary">
              Olá, {user?.name || 'Usuário'} 👋
            </p>
            <p className="text-xs" style={{ color: '#8891B4' }}>Bem-vindo de volta</p>
          </div>

          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', border: '2px solid rgba(124,92,252,0.6)', boxShadow: '0 0 12px rgba(124,92,252,0.3)' }}>
            {initials}
          </div>
        </div>

        <button onClick={logout}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:opacity-80"
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}
          title="Sair">
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
