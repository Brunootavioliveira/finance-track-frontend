import { useState } from 'react';
import { Wallet, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
    } catch (err) {
      setError(err.message || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e) => e.key === 'Enter' && submit();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#0D0F1C' }}
    >
      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 70% 50% at 30% 20%, rgba(124,92,252,0.1) 0%, transparent 60%),
                     radial-gradient(ellipse 50% 40% at 70% 80%, rgba(91,138,245,0.07) 0%, transparent 60%)`
      }} />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 0 24px rgba(124,92,252,0.4)' }}>
            <Wallet size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-white">
            Finance<span style={{ color: '#9B7DFF' }}>Track</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{
          background: 'linear-gradient(145deg, #1A1D3A, #13162B)',
          border: '1px solid rgba(124,92,252,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 0 60px rgba(124,92,252,0.08)',
        }}>
          {/* Tab toggle */}
          <div className="flex gap-2 mb-8 p-1 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {['login', 'register'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: mode === m ? 'linear-gradient(135deg, #7C5CFC, #5B8AF5)' : 'transparent',
                  color: mode === m ? '#fff' : '#4A5177',
                  boxShadow: mode === m ? '0 4px 12px rgba(124,92,252,0.35)' : 'none',
                }}
              >
                {m === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {/* Name field (register only) */}
            {mode === 'register' && (
              <Field icon={<User size={16} />} name="name" placeholder="Seu nome" value={form.name} onChange={handle} onKeyDown={onKey} />
            )}
            <Field icon={<Mail size={16} />} name="email" placeholder="Email" type="email" value={form.email} onChange={handle} onKeyDown={onKey} />
            <div className="relative">
              <Field
                icon={<Lock size={16} />}
                name="password"
                placeholder="Senha"
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handle}
                onKeyDown={onKey}
              />
              <button
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                style={{ color: '#4A5177' }}
                tabIndex={-1}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm px-4 py-3 rounded-xl font-medium"
                style={{ background: 'rgba(244,63,94,0.12)', color: '#F43F5E', border: '1px solid rgba(244,63,94,0.2)' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white mt-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #7C5CFC, #5B8AF5)', boxShadow: '0 4px 20px rgba(124,92,252,0.4)' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === 'login' ? 'Entrar na conta' : 'Criar conta'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: '#4A5177' }}>
          Seus dados estão protegidos com JWT
        </p>
      </div>
    </div>
  );
}

function Field({ icon, name, placeholder, type = 'text', value, onChange, onKeyDown }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative flex items-center">
      <span className="absolute left-4" style={{ color: focused ? '#9B7DFF' : '#4A5177', transition: 'color 0.2s' }}>
        {icon}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: 'rgba(0,0,0,0.3)',
          border: `1px solid ${focused ? 'rgba(124,92,252,0.5)' : 'rgba(255,255,255,0.07)'}`,
          color: '#EDF0FF',
        }}
      />
    </div>
  );
}
