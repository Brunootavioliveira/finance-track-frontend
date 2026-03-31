import { useState, useRef, useEffect } from 'react';
import { Wallet, LogOut, User, Mail, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const initials = (user?.name || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/5 sticky top-0 z-30"
      style={{ background: 'linear-gradient(90deg, #0D0F1C 0%, #13162B 100%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 0 20px rgba(124,92,252,0.3)' }}
        >
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Finance<span style={{ color: '#9B7DFF' }}>Track</span>
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Greeting - hidden on very small screens */}
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-white">
            Olá, {user?.name?.split(' ')[0] || 'Usuário'} 👋
          </p>
          <p className="text-xs" style={{ color: '#8891B4' }}>Bem-vindo de volta</p>
        </div>

        <div className="h-8 w-px hidden sm:block" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-full transition-all hover:opacity-90"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)',
                border: '2px solid rgba(124,92,252,0.6)',
                boxShadow: '0 0 12px rgba(124,92,252,0.3)',
              }}
            >
              {initials}
            </div>
            <ChevronDown
              size={14}
              style={{
                color: '#8891B4',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-3 w-60 rounded-2xl py-2 z-50"
              style={{
                background: 'linear-gradient(145deg, #1E2248, #13162B)',
                border: '1px solid rgba(124,92,252,0.2)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              }}
            >
              {/* User info */}
              <div className="px-4 py-3 mb-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white mb-3 mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)',
                    border: '2px solid rgba(124,92,252,0.4)',
                  }}
                >
                  {initials}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <User size={13} style={{ color: '#9B7DFF' }} />
                  <span className="text-sm font-semibold text-white truncate">{user?.name || 'Usuário'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} style={{ color: '#8891B4' }} />
                  <span className="text-xs truncate" style={{ color: '#8891B4' }}>{user?.email || ''}</span>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={() => { setDropdownOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all hover:opacity-80"
                style={{ color: '#F43F5E' }}
              >
                <LogOut size={14} />
                Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
