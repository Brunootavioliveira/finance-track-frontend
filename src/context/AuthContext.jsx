import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, removeToken, isAuthenticated } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      try {
        const token = getToken();
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.sub, name: payload.sub.split('@')[0] });
      } catch {
        setUser({ email: '', name: 'Usuário' });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await authAPI.login(email, password);
    try {
      const token = getToken();
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser({ email: payload.sub, name: payload.sub.split('@')[0] });
    } catch {
      setUser({ email, name: email.split('@')[0] });
    }
  };

  const register = async (name, email, password) => {
    await authAPI.register(name, email, password);
    await login(email, password);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
