import api from './api';

/**
 * Normalize backend role (PATIENT) to frontend format (Patient).
 */
function normalizeRole(role) {
  if (!role) return 'Patient';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Auth service — integrated with backend.
 */
const authService = {
  /**
   * Login with email and password.
   * POST /auth/login
   * Body: { email, password }
   */
  async login(email, password) {
    const data = await api.post('/auth/login', { email, password });

    return {
      id: data.id,
      name: data.name || email.split('@')[0],
      email: data.email || email,
      role: normalizeRole(data.role),
      token: data.token || null,
      joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      avatar: (data.name || email.split('@')[0]).charAt(0).toUpperCase(),
    };
  },

  /**
   * Register a new user.
   * POST /auth/register
   * Body: { name, email, password, phone, age, role }
   */
  async register(name, email, password, phone, age, role = 'PATIENT') {
    const data = await api.post('/auth/register', {
      name,
      email,
      password,
      phone,
      age: Number(age),
      role: role.toUpperCase(),
    });

    return {
      id: data.id,
      name: data.name || name,
      email: data.email || email,
      role: normalizeRole(data.role || role),
      token: data.token || null,
      joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      avatar: (data.name || name).charAt(0).toUpperCase(),
    };
  },
};

export default authService;
