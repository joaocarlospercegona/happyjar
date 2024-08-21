<template>
  <q-layout>
    <q-page-container
      style="
        /* background: url('images/2.png') center / cover no-repeat; */
        background-color: #e53a4d;
      "
    >
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
import EssentialLink from "components/EssentialLink.vue";
export default defineComponent({
  name: "MainLayout",
  components: {},
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
