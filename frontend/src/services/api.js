/**
 * Base API configuration.
 * Reads the backend URL from environment variables.
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * Generic fetch wrapper with JSON handling and error management.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.method !== 'GET' && options.method !== 'DELETE') {
    headers['Content-Type'] = 'application/json';
  }

  /* Attach JWT token if available */
  const stored = localStorage.getItem('medsutra_user');
  if (stored) {
    const user = JSON.parse(stored);
    if (user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Something went wrong');
  }

  return response.json();
}

const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body: body instanceof FormData ? body : JSON.stringify(body), ...options }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

export default api;
