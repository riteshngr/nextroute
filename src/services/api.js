

// Falls back to '/api' for production (Nginx proxies it to the backend)
const API_BASE = import.meta.env.VITE_API_BASE || '/api';


export async function apiGet(path) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}


export async function apiPost(path, body) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}


export async function apiPut(path, body) {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}


export async function apiDelete(path) {
  const headers = {};
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}



export function getToken() {
  return localStorage.getItem('nextroute_token');
}


export function setToken(token) {
  localStorage.setItem('nextroute_token', token);
}


export function removeToken() {
  localStorage.removeItem('nextroute_token');
}

// Decode the JWT payload (middle segment) to extract user info
export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Auto-logout if the token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }

    return {
      id: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}


export function isLoggedIn() {
  return getUser() !== null;
}


export function isAdmin() {
  const user = getUser();
  return user && user.role === 'ADMIN';
}


export function logout() {
  removeToken();
}
