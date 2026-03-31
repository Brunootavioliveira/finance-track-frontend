const BASE_URL = 'https://finance-track-api-6n9c.onrender.com';

export const getToken = () => localStorage.getItem('ft_token');
export const setToken = (t) => localStorage.setItem('ft_token', t);
export const removeToken = () => localStorage.removeItem('ft_token');
export const isAuthenticated = () => !!getToken();
export const getName = () => localStorage.getItem('ft_name');
export const setName = (n) => localStorage.setItem('ft_name', n);
export const removeName = () => localStorage.removeItem('ft_name');

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const authAPI = {
  register: (name, email, password) =>
    fetch(`${BASE_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }).then(handleResponse),

  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      if (!res.ok) throw new Error('Email ou senha incorretos');
      const token = await res.text();
      setToken(token);
      return token;
    }),
};

export const dashboardAPI = {
  get: () =>
    fetch(`${BASE_URL}/dashboard`, { headers: authHeaders() }).then(handleResponse),
};

export const expenseAPI = {
  list: () =>
    fetch(`${BASE_URL}/expense`, { headers: authHeaders() }).then(handleResponse),

  create: (description, amount, categoryId) =>
    fetch(`${BASE_URL}/expense`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ description, amount, categoryId }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/expense/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};

export const incomeAPI = {
  list: () =>
    fetch(`${BASE_URL}/income`, { headers: authHeaders() }).then(handleResponse),

  create: (description, amount) =>
    fetch(`${BASE_URL}/income`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        description,
        amount,
        dateTime: new Date().toISOString().slice(0, 19),
      }),
    }).then(handleResponse),

  delete: (id) =>
    fetch(`${BASE_URL}/income/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};

export const categoryAPI = {
  list: () =>
    fetch(`${BASE_URL}/category`, { headers: authHeaders() }).then(handleResponse),

  create: (name) =>
    fetch(`${BASE_URL}/category`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ name }),
    }).then(handleResponse),
};
