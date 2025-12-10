<template>
  <div
    style="margin: 5vw; background-color: #fee2b4; width: 90vw; height: 80vh"
  >
    <div
      class="col-12 flex flex-center text-primary text-center text-bold text-h6 q-py-md"
    >
      <div style="margin-top: 5vh">
        Essa ação não pode ser <br />
        desfeita!
      </div>
    </div>
    <div class="col-12 flex flex-center q-pa-lg">
      <q-img
        src="images/triste.png"
        style="max-width: 40vw; max-height: 50vh"
      />
    </div>
    <div
      class="col-12 flex flex-center text-primary text-center text-bold text-h6 q-py-sm"
    >
      Tem certeza de que quer isso ?
    </div>
    <div class="col-12 flex flex-center q-px-md q-py-sm">
      <q-btn
        class="full-width"
        label="NÃO! Ainda quero usar o App"
        color="primary"
        outlined
        no-caps
        dense
        @click="$emit('mudarStep', 3)"
      />
    </div>
    <div class="col-12 flex flex-center q-px-md">
      <q-btn
        class="bg-white full-width"
        label="Sim, pode apagar tudo"
        color="primary"
        outline
        no-caps
        dense
        @click="apagarConta"
        :loading="carregando"
        :disable="carregando"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import ApiService from 'src/services/api';

export default defineComponent({
  name: "ConfirmarApagarDados",
  emits: ['mudarStep'],
  setup(props, context) {
    const router = useRouter();
    const $q = useQuasar();
    const carregando = ref(false);

    async function apagarConta() {
      try {
        carregando.value = true;

        const token = localStorage.getItem('token');
        if (!token) {
          $q.notify({
            message: 'Você precisa fazer login',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        // Chama DELETE /api/usuarios/me usando o serviço
        const resposta = await ApiService.usuario.deletar();

        if (resposta.data.sucesso) {
          $q.notify({
            message: 'Sua conta foi deletada permanentemente',
            color: 'positive',
            icon: 'check_circle'
          });

          // Limpa todos os dados do localStorage
          localStorage.removeItem('usuario');
          localStorage.removeItem('token');
          localStorage.clear();

          // Aguarda 1 segundo e redireciona para tela de boas vindas
          setTimeout(() => {
            router.push('/boasVindas');
          }, 1000);
        }
      } catch (error) {
        console.error('Erro ao apagar conta:', error);

        if (error.response?.status === 401) {
          $q.notify({
            message: 'Sessão expirada. Faça login novamente.',
            color: 'negative',
            icon: 'error'
          });

          // Limpa localStorage e redireciona
          localStorage.clear();
          router.push('/boasVindas');
        } else {
          $q.notify({
            message: 'Erro ao apagar conta. Tente novamente.',
            color: 'negative',
            icon: 'error'
          });
        }
      } finally {
        carregando.value = false;
      }
    }

    return {
      carregando,
      apagarConta,
    };
  },
});
</script>
