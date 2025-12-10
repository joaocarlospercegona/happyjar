<template>
  <q-page class="welcome-page">
    <div class="content-container">
      <q-img src="images/2.png" class="logo-image" />
    </div>
    <div class="google-login-container">
      <q-btn
        class="google-login-btn"
        flat
        @click="loginComGoogle"
        :loading="carregando"
        :disable="carregando"
      >
        <div class="btn-content">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="google-icon" />
          <div class="login-text-center">
            Entrar com Google
          </div>
        </div>
      </q-btn>
    </div>
  </q-page>
</template>
<script>
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import ApiService from 'src/services/api';

export default {
  data() {
    return {
      carregando: false,
    };
  },
  mounted() {
    // Verifica se já está logado
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('usuario');

    if (token && usuario) {
      console.log('Usuário já logado, redirecionando...');
      this.$router.replace('/momento');
      return;
    }

    // Inicializa o Google Auth para Capacitor
    const isCapacitor = window.Capacitor && window.Capacitor.getPlatform() !== 'web';

    if (isCapacitor) {
      console.log('Plataforma Capacitor detectada:', window.Capacitor.getPlatform());
      GoogleAuth.initialize({
        clientId: '361004843516-a53aavo3qjmn4b80dm7fhuvkls7b433c.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
    } else {
      console.log('Usando modo web (navegador)');
      // Carrega script para navegador web
      this.loadGoogleScript();
    }
  },
  methods: {
    loadGoogleScript() {
      if (!document.getElementById('google-identity-script')) {
        const script = document.createElement('script');
        script.id = 'google-identity-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    },

    async loginComGoogle() {
      try {
        this.carregando = true;
        console.log('Iniciando login com Google...');

        // Verifica se está rodando no Capacitor (mobile) - não apenas web
        const isCapacitor = window.Capacitor && window.Capacitor.getPlatform() !== 'web';

        if (isCapacitor) {
          console.log('Usando Capacitor Google Auth (mobile)');
          await this.loginComGoogleCapacitor();
        } else {
          console.log('Usando Google Sign-In web (navegador)');
          await this.loginComGoogleWeb();
        }

      } catch (error) {
        console.error('Erro ao iniciar login:', error);
        this.$q.notify({
          message: 'Erro ao iniciar login com Google.',
          color: 'negative',
          icon: 'error'
        });
        this.carregando = false;
      }
    },

    // Login nativo para Capacitor (mobile)
    async loginComGoogleCapacitor() {
      try {
        const result = await GoogleAuth.signIn();
        console.log('Login Capacitor bem-sucedido:', result);

        // result contém: email, familyName, givenName, id, imageUrl, name, authentication
        await this.handleGoogleLoginSuccess({
          idToken: result.authentication.idToken,
          nome: result.name,
          email: result.email,
          foto: result.imageUrl
        });
      } catch (error) {
        console.error('Erro no login Capacitor:', error);
        this.carregando = false;

        // Ignora se usuário cancelou o login
        if (error.error === 'popup_closed_by_user' || error.message?.includes('popup_closed_by_user')) {
          console.log('Usuário cancelou o login');
          return;
        }

        this.$q.notify({
          message: 'Erro ao fazer login com Google.',
          color: 'negative',
          icon: 'error'
        });
      }
    },

    // Login web para navegador (desenvolvimento)
    async loginComGoogleWeb() {
      try {
        // Carrega o script do Google Identity Services se ainda não foi carregado
        if (!document.getElementById('google-identity-script')) {
          const script = document.createElement('script');
          script.id = 'google-identity-script';
          script.src = 'https://accounts.google.com/gsi/client';
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
        }

        // Aguarda o script carregar
        if (typeof google === 'undefined' || !google.accounts) {
          await new Promise((resolve, reject) => {
            let tentativas = 0;
            const maxTentativas = 50;

            const checkGoogle = setInterval(() => {
              tentativas++;
              if (typeof google !== 'undefined' && google.accounts) {
                clearInterval(checkGoogle);
                resolve();
              } else if (tentativas >= maxTentativas) {
                clearInterval(checkGoogle);
                reject(new Error('Timeout ao carregar script do Google'));
              }
            }, 100);
          });
        }

        // Inicializa o Google Identity Services
        google.accounts.id.initialize({
          client_id: '361004843516-a53aavo3qjmn4b80dm7fhuvkls7b433c.apps.googleusercontent.com',
          callback: this.handleCredentialResponseWeb,
          auto_select: false,
        });

        // Abre o popup de login
        google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Prompt não exibido:', notification.getNotDisplayedReason());
            this.$q.notify({
              message: 'Não foi possível abrir o login do Google.',
              color: 'warning',
              icon: 'warning'
            });
            this.carregando = false;
          }
        });

      } catch (error) {
        console.error('Erro no login web:', error);
        this.$q.notify({
          message: 'Erro ao carregar Google Sign-In.',
          color: 'negative',
          icon: 'error'
        });
        this.carregando = false;
      }
    },

    // Callback do login web
    handleCredentialResponseWeb(response) {
      const googleToken = response.credential;
      const payload = this.decodeJWT(googleToken);

      this.handleGoogleLoginSuccess({
        idToken: googleToken,
        nome: payload.name,
        email: payload.email,
        foto: payload.picture
      });
    },

    // Processa o login bem-sucedido (nativo ou web)
    async handleGoogleLoginSuccess(userData) {
      try {
        console.log('Processando login do Google:', userData);

        // Envia o token para o backend validar e criar/logar usuário usando o serviço
        const resposta = await ApiService.auth.loginComGoogle(userData.idToken);

        console.log('Login bem-sucedido, salvando dados do usuário', resposta);
        if (resposta.data.sucesso) {
          // Salva dados do usuário localmente
          const usuario = {
            nome: resposta.data.usuario.nome,
            email: resposta.data.usuario.email,
            foto: resposta.data.usuario.foto,
            id: resposta.data.usuario.id,
            acceptedTerms: resposta.data.usuario.acceptedTerms || false
          };

          console.log('Usuário para salvar:', usuario);
          console.log('acceptedTerms do backend:', resposta.data.usuario.acceptedTerms);

          localStorage.setItem('usuario', JSON.stringify(usuario));
          localStorage.setItem('token', resposta.data.token);

          this.$q.notify({
            message: `Bem-vindo, ${usuario.nome}!`,
            color: 'positive',
            icon: 'check_circle'
          });

          setTimeout(() => {
            // Verifica se o usuário aceitou os termos
            console.log('Verificando acceptedTerms:', usuario.acceptedTerms, typeof usuario.acceptedTerms);
            if (usuario.acceptedTerms === true) {
              console.log('Indo para /momento');
              this.$router.push('/momento');
            } else {
              console.log('Indo para /termos');
              this.$router.push('/termos');
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Erro no login:', error);

        this.$q.notify({
          message: error.response?.data?.erro || 'Erro ao fazer login com Google. Verifique se o backend está rodando.',
          color: 'negative',
          icon: 'error'
        });
      } finally {
        this.carregando = false;
      }
    },

    // Decodifica o JWT do Google para visualizar os dados
    decodeJWT(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    }
  },
};
</script>

<style scoped>
.welcome-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 20px;
}

.content-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 240px;
  max-width: 70vw;
}

.google-login-container {
  padding-bottom: 40px;
}

.google-login-btn {
  width: 100%;
  background-color: white;
  border-radius: 4px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  text-transform: none;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.google-icon {
  width: 18px;
  height: 18px;
  margin-right: 12px;
}

.google-icon-small {
  width: 18px;
  height: 18px;
  margin-left: 8px;
}

.login-text-center {
  font-size: 14px;
  font-weight: 500;
  color: #3c4043;
}

.login-text {
  flex: 1;
  text-align: left;
}

.login-label {
  font-size: 14px;
  font-weight: 500;
  color: #3c4043;
}

.login-email {
  font-size: 12px;
  color: #5f6368;
}

</style>

