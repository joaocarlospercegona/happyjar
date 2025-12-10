<template>
  <q-page>
    <GravarMomento v-if="step == 1" @salvarMomento="salvarMomento" />
    <SucessoMomento v-if="step == 2" @voltarInicio="voltarInicio" />
    <FalhaMomento v-if="step == 3" />
    <SentimentoMomento v-if="step == 4" @voltarInicio="voltarInicio" />
  </q-page>
</template>
<script>
import { ref } from "vue";
import GravarMomento from "components/GravarMomento.vue";
import SucessoMomento from "components/SucessoMomento.vue";
import SentimentoMomento from "components/SentimentoMomento.vue";
import FalhaMomento from "components/FalhaMomento.vue";

import { useQuasar } from 'quasar';
import ApiService from 'src/services/api';

export default {
  components: {
    GravarMomento,
    SucessoMomento,
    FalhaMomento,
    SentimentoMomento,
  },
  setup() {
    const $q = useQuasar();
    const step = ref(1);

    async function voltarInicio(val) {
      step.value = 1;
    }

    async function salvarMomento(texto) {
      try {
        // Validação básica
        if (!texto || texto.trim().length === 0) {
          $q.notify({
            message: 'O texto do momento é obrigatório',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        if (texto.length > 1000) {
          $q.notify({
            message: 'O texto deve ter no máximo 1000 caracteres',
            color: 'negative',
            icon: 'error'
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

        // Chama a API POST /api/momentos usando o serviço
        const resposta = await ApiService.momentos.criar(texto);

        if (resposta.data.sucesso) {
          console.log('Momento salvo:', resposta.data.momento);

          // Verifica se deve mostrar enquete de sentimento (a cada 10 momentos)
          if (resposta.data.mostrarEnquete) {
            step.value = 4; // Vai para tela de sentimento
          } else {
            step.value = 2; // Vai para tela de sucesso
          }
        }
      } catch (error) {
        console.error('Erro ao salvar momento:', error);

        // Verifica se é erro de conexão
        const isConnectionError = !error.response || error.code === 'ERR_NETWORK' || error.code === 'ERR_CONNECTION_REFUSED';

        if (isConnectionError) {
          console.warn('⚠️  Backend offline. Modo DEMO - momento não será salvo.');
          $q.notify({
            message: 'Momento salvo localmente! (Backend offline)',
            color: 'warning',
            icon: 'info'
          });
          // Simula sucesso sem mostrar enquete
          step.value = 2;
        } else if (error.response?.status === 401) {
          $q.notify({
            message: 'Sessão expirada. Faça login novamente.',
            color: 'negative',
            icon: 'error'
          });
          step.value = 3;
        } else if (error.response?.status === 400) {
          $q.notify({
            message: error.response.data.erro || 'Dados inválidos',
            color: 'negative',
            icon: 'error'
          });
          step.value = 3;
        } else {
          $q.notify({
            message: 'Erro ao salvar momento. Tente novamente.',
            color: 'negative',
            icon: 'error'
          });
          step.value = 3;
        }
      }
    }

    return {
      step,
      salvarMomento,
      voltarInicio,
    };
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
