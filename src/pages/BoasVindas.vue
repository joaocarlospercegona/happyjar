<template>
  <q-page class="flex flex-center">
    <div style="margin-top: -20vh">
      <q-img src="images/2.png" width="300px" />
      <div class="q-gutter-y-lg sempre-fixo">
        <q-btn
          type="submit"
          class="full-width text-body1 q-pa-xs text-white"
          label="Sing in"
          color="white"
          text-color="black"
          to="/termos"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    // if (!this.isBlank(this.getLogin.token)) this.$router.push('/')
  },
};
</script>
<style scoped>
.imagem-centro {
  position: fixed;
  top: 0;
  bottom: 30vh;
  left: 0;
  right: 0;
}
</style>
