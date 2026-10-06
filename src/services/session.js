let onSessionExpired = () => {};

export function configureSession(handler) {
  onSessionExpired = handler;
}

export function tokenIsValid(token, now = Date.now()) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')));
    return Number.isFinite(payload.exp) && payload.exp * 1000 > now;
  } catch {
    return false;
  }
}

export function expireSession(expectedToken = localStorage.getItem('token')) {
  // A late response from an old session must not log out a new login.
  if (expectedToken !== localStorage.getItem('token')) return;
  const hadSession = Boolean(expectedToken || localStorage.getItem('usuario'));
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  if (hadSession) onSessionExpired();
}

export function hasValidSession() {
  const token = localStorage.getItem('token');
  if (tokenIsValid(token) && localStorage.getItem('usuario')) return true;
  expireSession(token);
  return false;
}
