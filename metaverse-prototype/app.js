// Simple client-side auth and utilities
const STORAGE_KEYS = {
  users: 'lm_users',
  session: 'lm_session',
};

function getUsers() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]'); } catch { return []; }
}

function setUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null'); } catch { return null; }
}

function setSession(session) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function registerUser({ name, email, password }) {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('Email already registered');
  }
  const newUser = { id: 'u_' + Math.random().toString(36).slice(2, 10), name, email, passwordHash: password };
  users.push(newUser);
  setUsers(users);
  setSession({ userId: newUser.id, name: newUser.name, email: newUser.email, provider: 'credentials' });
  return newUser;
}

function loginUser({ email, password }) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === password);
  if (!user) throw new Error('Invalid credentials');
  setSession({ userId: user.id, name: user.name, email: user.email, provider: 'credentials' });
  return user;
}

function oauthLogin(provider) {
  const providerLower = (provider || '').toLowerCase();
  const name = providerLower === 'google' ? 'Google User' : providerLower === 'facebook' ? 'Facebook User' : 'Demo User';
  const email = providerLower ? providerLower + '+demo@example.com' : 'demo@example.com';
  setSession({ userId: 'oauth_' + providerLower, name, email, provider: providerLower || 'demo' });
}

function logout() { clearSession(); location.href = './index.html'; }

function requireAuth() {
  const session = getSession();
  if (!session) { location.href = './auth.html'; return null; }
  return session;
}

function formatPercent(n) { return Math.round(n * 100) + '%'; }

window.App = {
  getUsers, setUsers,
  getSession, setSession, clearSession,
  registerUser, loginUser, oauthLogin,
  logout, requireAuth,
  formatPercent,
};

