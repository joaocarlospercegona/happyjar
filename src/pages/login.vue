<template>
  <q-page class="login-page">
    <div class="login-content">
      <q-card class="login-card bg-white q-pa-md">
        <div class="q-mb-md">
          <q-input v-model="login" label="Login" outlined />
        </div>
        <div class="q-mb-md">
          <q-input v-model="password" label="Senha" type="password" outlined />
        </div>
        <div>
          <q-btn class="full-width text-body1 q-pa-xs" label="Logar" color="white" text-color="black" @click="logarConta" no-caps />
        </div>
      </q-card>
    </div>
    <div class="login-footer">
      <q-img src="images/logoprincipal.png" class="footer-logo" />
      <div class="version-text">Versão 1.0 - Maio/2024</div>
    </div>
  </q-page>
</template>
<script>
import AuthController from 'src/Controller/Auth'
export default {
  mixins: [AuthController],
  data() {
    return {
      login: '',
      password: '',
    };
  },
  methods: {
    async logarConta(){
      // Mock login - vai direto para a tela principal
      this.$router.push('/momento');
    }
  },
  created() {
    // if (!this.isBlank(this.getLogin.token)) this.$router.push('/')
  },
};
</script>
<style scoped>
.login-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  overflow: hidden;
}

.login-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
}

.footer-logo {
  width: 150px;
  margin-bottom: 10px;
}

.version-text {
  text-align: center;
  font-size: 0.9rem;
}
</style>
