<template>
  <div style="background-color: #fee2b4">
    <q-drawer
      style="background-color: #fee2b4"
      v-model="leftDrawerOpen"
      side="left"
    >
      <q-list style="background-color: white"> asddas </q-list>
    </q-drawer>
  </div>
</template>

<script>
import AuthController from "src/Controller/Auth";
export default {
  mixins: [AuthController],
  props: ["itensDrawer"],
  data() {
    return {
      leftDrawerOpen: false,
    };
  },
  methods: {
    toggleDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    async logoff() {
      await this.deslogar();
    },
    irParaHome() {
      this.$router.push("/");
    },
    irParaPerfil() {
      this.$router.push("/perfil");
    },
  },
};
</script>

<style></style>
