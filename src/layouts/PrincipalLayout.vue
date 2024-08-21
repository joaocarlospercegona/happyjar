<template>
  <q-layout>
    <q-page-container style="background-color: #e53a4d">
      <div class="row justify-end">
        <q-btn
          icon="person"
          push
          color="white"
          text-color="primary"
          style="margin-top: 15px; margin-right: 20px"
          round
          @click="toggleDrawer"
        />
      </div>
      <q-drawer
        style="background-color: #fee2b4; min-width: 100vw"
        v-model="leftDrawerOpen"
        side="left"
      >
        <div class="row justify-end">
          <q-btn
            icon="person"
            push
            color="white"
            text-color="grey"
            style="margin-top: 15px; margin-right: 20px"
            round
            @click="toggleDrawer"
          />
        </div>
        <div class="q-pa-lg" style="margin-top: 10vh">
          <q-list
            class="flex flex-start column text-primary text-bold"
            style="font-size: 1rem"
          >
            <q-item clickable @click="$router.push('/meusDados')">
              Meus Dados
            </q-item>
            <q-separator color="primary" size="1px" />
            <q-item> Ver uma Felecidade </q-item>
            <q-separator color="primary" size="1px" />
            <q-item clickable @click="$router.push('/termos')">
              Política de Privacidade
            </q-item>
            <q-separator color="primary" size="1px" />
            <q-item> Sair </q-item>
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
import { defineComponent, ref, useSSRContext } from "vue";
import EssentialLink from "components/EssentialLink.vue";
export default defineComponent({
  name: "MainLayout",
  components: {},
  setup() {
    const leftDrawerOpen = ref(false);
    const ssrContext = useSSRContext();
    return {
      leftDrawerOpen,
      toggleDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
