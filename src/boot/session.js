import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';
import ApiService from 'src/services/api';
import { configureSession, hasValidSession } from 'src/services/session';

export default boot(({ router }) => {
  configureSession(() => {
    Notify.create({ type: 'warning', message: 'Sua sessão expirou. Entre novamente.' });
    router.replace('/boasVindas');
  });

  let checking = false;
  async function checkSession() {
    if (!hasValidSession() || checking) return;
    checking = true;
    try {
      // Also detects tokens rejected by the server before their expiry date.
      await ApiService.usuario.obterDados();
    } catch {
      // The API interceptor handles 401. Offline/server errors keep the session.
    } finally {
      checking = false;
    }
  }

  checkSession();
  const timer = setInterval(hasValidSession, 15000);
  const onVisible = () => {
    if (document.visibilityState === 'visible') checkSession();
  };
  document.addEventListener('visibilitychange', onVisible);
  document.addEventListener('resume', checkSession);
  window.addEventListener('focus', checkSession);

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
      document.removeEventListener('resume', checkSession);
      window.removeEventListener('focus', checkSession);
    });
  }
});
