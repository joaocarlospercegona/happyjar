<template>
  <div class="sentimento-page">
    <div class="sentimento-card">
      <div class="text-center text-primary text-bold text-h6 q-mb-md">
        Como você se sente no agora?
      </div>
      <div class="emojis-container q-mb-md">
        <q-img
          :src="escolhido == 1 ? 'images/triste.png' : 'images/tristeEscuro.svg'"
          class="emoji-img"
          @click="escolhido = 1"
        />
        <q-img
          :src="escolhido == 2 ? 'images/normal.png' : 'images/felizEscuro.svg'"
          class="emoji-img"
          @click="escolhido = 2"
        />
        <q-img
          :src="escolhido == 3 ? 'images/feliz.png' : 'images/MaravilhosoEscuro.svg'"
          class="emoji-img"
          @click="escolhido = 3"
        />
      </div>
      <div class="q-gutter-y-sm">
        <q-btn
          class="full-width"
          outlined
          color="primary"
          label="Salvar sentimento"
          :disable="escolhido < 1"
          @click="salvarSentimento"
          dense
          no-caps
        />
        <q-btn
          class="bg-white full-width"
          outline
          text-color="primary"
          label="Não fazer isso agora"
          dense
          no-caps
          @click="pularSentimento"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import ApiService from 'src/services/api';

export default defineComponent({
  name: "SentimentoMomento",
  setup(props, context) {
    const router = useRouter();
    const $q = useQuasar();
    const escolhido = ref(0);

    async function salvarSentimento() {
      try {
        if (escolhido.value < 1 || escolhido.value > 3) {
          $q.notify({
            message: 'Selecione como você se sente',
            color: 'warning',
            icon: 'warning'
          });
          return;
        }

        // Pega o token do localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          $q.notify({
            message: 'Você precisa fazer login novamente',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        // Chama a API POST /api/sentimentos usando o serviço
        const resposta = await ApiService.sentimentos.registrar(escolhido.value);

        if (resposta.data.sucesso) {
          console.log('Sentimento salvo:', resposta.data.sentimento);

          $q.notify({
            message: 'Sentimento registrado com sucesso!',
            color: 'positive',
            icon: 'check_circle'
          });

          // Volta para o início (tela de gravar momento)
          context.emit("voltarInicio", 1);
        }
      } catch (error) {
        console.error('Erro ao salvar sentimento:', error);

        if (error.response?.status === 401) {
          $q.notify({
            message: 'Sessão expirada. Faça login novamente.',
            color: 'negative',
            icon: 'error'
          });
        } else if (error.response?.status === 400) {
          $q.notify({
            message: error.response.data.erro || 'Nível de sentimento inválido',
            color: 'negative',
            icon: 'error'
          });
        } else {
          $q.notify({
            message: 'Erro ao registrar sentimento. Tente novamente.',
            color: 'negative',
            icon: 'error'
          });
        }
      }
    }

    function pularSentimento() {
      console.log('Usuário pulou o registro de sentimento');
      // Volta para o início sem salvar
      context.emit("voltarInicio", 1);
    }

    return {
      escolhido,
      salvarSentimento,
      pularSentimento,
    };
  },
});
</script>

<style scoped>
.sentimento-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -80px;
  overflow: hidden;
}

.sentimento-card {
  background-color: #fee2b4;
  border-radius: 10px;
  padding: 30px 20px;
  width: 100%;
  max-width: 400px;
}

.emojis-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
}

.emoji-img {
  width: 30%;
  max-width: 100px;
  cursor: pointer;
  transition: transform 0.2s;
}

.emoji-img:active {
  transform: scale(0.95);
}
</style>
