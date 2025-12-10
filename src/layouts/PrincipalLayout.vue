<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="main-container">
      <div class="header-bar">
        <q-btn
          push
          color="white"
          text-color="primary"
          round
          @click="toggleDrawer"
        >
          <q-avatar v-if="fotoUsuario" size="40px">
            <img :src="fotoUsuario" />
          </q-avatar>
          <q-icon v-else name="person" />
        </q-btn>
      </div>
      <q-drawer
        style="background-color: #fee2b4; min-width: 100vw"
        v-model="leftDrawerOpen"
        side="left"
      >
        <div class="row justify-end">
          <q-btn
            push
            color="white"
            text-color="grey"
            style="margin-top: 15px; margin-right: 20px"
            round
            @click="toggleDrawer"
          >
            <q-avatar v-if="fotoUsuario" size="40px">
              <img :src="fotoUsuario" />
            </q-avatar>
            <q-icon v-else name="person" />
          </q-btn>
        </div>
        <div class="q-pa-lg" style="margin-top: 10vh">
          <q-list
            class="flex flex-start column text-primary text-bold"
            style="font-size: 1rem"
          >
            <q-item clickable @click="navegarPara('/meusDados')">
              Meus Dados
            </q-item>
            <q-separator color="primary" size="1px" />
            <q-item clickable @click="navegarPara('/verFelicidade')"> Ver uma Felecidade </q-item>
            <q-separator color="primary" size="1px" />
            <q-item clickable @click="navegarPara('/termos')">
              Política de Privacidade
            </q-item>
            <q-separator color="primary" size="1px" />
            <q-item clickable @click="sair"> Sair </q-item>
            <q-separator color="primary" size="1px" />
          </q-list>
        </div>
        <div class="row justify-center" style="margin-top: 15vh">
          <div class="col-5">
            <q-img src="images/logoprincipal.png" />
          </div>
          <div class="q-py-lg col-8 text-center">Versão 1.0 - Maio/2024</div>
        </div>
      </q-drawer>
      <transition
        mode="out-in"
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <router-view key="router"></router-view>
      </transition>
    </q-page-container>
  </q-layout>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "MainLayout",
  components: {},
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const $q = useQuasar();
    const fotoUsuario = ref("");

    // Carrega foto do localStorage
    const usuarioLocal = localStorage.getItem('usuario');
    if (usuarioLocal) {
      const usuario = JSON.parse(usuarioLocal);
      fotoUsuario.value = usuario.foto || "";
    }

    function navegarPara(rota) {
      leftDrawerOpen.value = false;
      router.push(rota);
    }

    function sair() {
      // Fecha o drawer
      leftDrawerOpen.value = false;

      // Limpa todo o localStorage
      localStorage.clear();

      $q.notify({
        message: 'Você saiu com sucesso!',
        color: 'positive',
        icon: 'check_circle',
        timeout: 1500
      });

      // Redireciona para a tela de login
      router.push('/boasVindas');
    }

    return {
      leftDrawerOpen,
      fotoUsuario,
      toggleDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      navegarPara,
      sair
    };
  },
});
</script>

<style scoped>
.main-container {
  background-color: #e53a4d;
  height: 100vh;
  overflow: hidden;
}

.header-bar {
  display: flex;
  justify-content: flex-end;
  padding: 15px 20px;
}
</style>
