const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/SplashScreen.vue") }],
  },
  {
    path: "/login",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/login.vue") }],
  },
  {
    path: "/boasVindas",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/BoasVindas.vue") }],
  },
  {
    path: "/termos",
    component: () => import("layouts/TermoLayout.vue"),
    children: [{ path: "", component: () => import("pages/Termos.vue") }],
  },
  {
    path: "/momento",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [{ path: "", component: () => import("pages/Momento.vue") }],
  },
  {
    path: "/meusDados",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [{ path: "", component: () => import("pages/MeusDados.vue") }],
  },
  {
    path: "/apagarDados",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [{ path: "", component: () => import("pages/ApagarDados.vue") }],
  },
  {
    path: "/verFelicidade",
    component: () => import("layouts/PrincipalLayout.vue"),
    children: [{ path: "", component: () => import("pages/VerFelicidade.vue") }],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
