// import api from './api';

/**
 * Auth service — currently mocked, ready for backend integration.
 *
 * When backend is ready, uncomment the api import and replace
 * the mock implementations with real API calls.
 */
const authService = {
  /**
   * Login with email and password.
   * TODO: Replace with `api.post('/auth/login', { email, password })`
   */
  async login(email, password) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    const username = email.split('@')[0];
    return {
      name: username.charAt(0).toUpperCase() + username.slice(1),
      email,
      role: 'Patient',
      joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      avatar: username.charAt(0).toUpperCase(),
    };
  },

  /**
   * Register a new user.
   * TODO: Replace with `api.post('/auth/register', { name, email, password })`
   */
  async register(name, email, password) {
    await new Promise((resolve) => setTimeout(resolve, 900));

    return {
      name,
      email,
      role: 'Patient',
      joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      avatar: name.charAt(0).toUpperCase(),
    };
  },
};

export default authService;
