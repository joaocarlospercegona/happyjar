import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Guard de navegação - protege rotas que precisam de autenticação
  Router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');
    const isLoggedIn = token && usuario;

    // Rotas públicas que não precisam de login
    const publicRoutes = ['/', '/login', '/boasVindas', '/termos'];
    const isPublicRoute = publicRoutes.includes(to.path);

    // Se está indo para rota pública
    if (isPublicRoute) {
      // Se já está logado e tentando acessar login/boasVindas, redireciona para momento
      if (isLoggedIn && (to.path === '/boasVindas' || to.path === '/login')) {
        next('/momento');
      } else {
        next();
      }
    } else {
      // Rota privada - precisa estar logado
      if (isLoggedIn) {
        next();
      } else {
        // Não está logado, redireciona para login
        next('/boasVindas');
      }
    }
  });

  return Router
})
