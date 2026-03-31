import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getToken, removeToken, isAuthenticated, getName, setName, removeName } from '../services/api';

const AuthContext = createContext(null);

function getUserFromToken() {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const savedName = getName();
    return {
      email: payload.sub,
      name: savedName || payload.sub.split('@')[0],
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUserFromToken());
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    await authAPI.login(email, password);
    setUser(getUserFromToken());
  };

  const register = async (name, email, password) => {
    await authAPI.register(name, email, password);
    // Salva o nome verdadeiro antes do login
    setName(name);
    await authAPI.login(email, password);
    setUser({ email, name });
  };

  const logout = () => {
    removeToken();
    removeName();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
