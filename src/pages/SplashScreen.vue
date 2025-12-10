<template>
  <q-page class="splash-container">
    <video
      ref="splashVideo"
      autoplay
      muted
      playsinline
      @ended="goToNextScreen"
      class="fullscreen-video"
    >
      <source src="images/animação 200x300px.mp4" type="video/mp4" />
    </video>
  </q-page>
</template>

<script>
export default {
  mounted() {
    // Fallback: se o vídeo não carregar ou der erro, vai para próxima tela após 3 segundos
    setTimeout(() => {
      this.goToNextScreen();
    }, 3000);
  },
  methods: {
    goToNextScreen() {
      this.$router.push('/boasVindas');
    }
  }
};
</script>

<style scoped>
.splash-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #e53a4d;
}

.fullscreen-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
