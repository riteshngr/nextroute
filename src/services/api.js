

// In development, Vite proxy or direct call to backend
// In production (behind Nginx), the /api prefix is proxied to Tomcat
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

/**
 * GET request to the backend API.
 */
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

/**
 * POST request to the backend API.
 */
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

/**
 * PUT request to the backend API.
 */
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

/**
 * DELETE request to the backend API.
 */
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


/**
 * Get JWT token from localStorage.
 */
export function getToken() {
  return localStorage.getItem('nextroute_token');
}

/**
 * Store JWT token in localStorage.
 */
export function setToken(token) {
  localStorage.setItem('nextroute_token', token);
}

/**
 * Remove JWT token (logout).
 */
export function removeToken() {
  localStorage.removeItem('nextroute_token');
}

/**
 * Decode the JWT payload to get user info (id, name, email, role).
 * JWT format: header.payload.signature — we decode the middle part.
 * Returns null if no token or invalid.
 */
export function getUser() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    // Check if token is expired
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

/**
 * Check if user is logged in.
 */
export function isLoggedIn() {
  return getUser() !== null;
}

/**
 * Check if logged-in user is admin.
 */
export function isAdmin() {
  const user = getUser();
  return user && user.role === 'ADMIN';
}

/**
 * Logout — remove token.
 */
export function logout() {
  removeToken();
}
