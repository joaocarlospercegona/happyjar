<template>
  <q-page class="meus-dados-page">
    <div class="dados-container">
      <div class="dados-content">
        <div class="row q-mb-md">
          <div class="col-4">
            <q-avatar v-if="fotoUsuario" size="80px" class="avatar-icon">
              <img :src="fotoUsuario" />
            </q-avatar>
            <q-icon
              v-else
              name="person"
              color="grey"
              size="lg"
              class="avatar-icon"
            />
          </div>
          <div class="col-8 flex flex-center">
            <q-btn
              class="full-width"
              color="primary"
              label="Alterar"
              icon="fas fa-save"
              dense
              no-caps
            />
          </div>
        </div>
        <div>
          <span class="text-primary">Nome</span>
          <q-input
            v-model="dados.nome"
            placeholder="Felisberto da Silva"
            dense
            outlined
            color="primary"
            label-color="primary"
            bg-color="white"
            class="q-mb-md"
          />
        </div>
        <div>
          <span class="text-primary">E-mail</span>
          <q-input
            v-model="dados.email"
            placeholder="email@exemplo.com"
            dense
            outlined
            color="primary"
            label-color="primary"
            bg-color="white"
            class="q-mb-md"
          />
        </div>
        <div class="q-mb-md">
          <q-btn
            color="primary"
            label="Atualizar Dados"
            class="full-width"
            no-caps
            @click="atualizarDados"
            :loading="carregando"
            :disable="carregando"
          />
        </div>
        <q-separator color="primary" size="2px" class="q-my-lg" />
        <div class="text-primary text-h6 text-center q-mb-md">Zona do Perigo</div>
        <div class="q-mb-md">
          <q-btn
            label="Apagar os Meus Dados"
            class="bg-white full-width"
            outline
            text-color="primary"
            dense
            no-caps
            @click="$router.push('/apagarDados')"
          />
        </div>
        <div>
          <q-btn
            label="Voltar para Tela Inicial"
            class="full-width"
            color="primary"
            dense
            no-caps
            @click="$router.push('/momento')"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref, onMounted } from "vue";
import { useQuasar } from 'quasar';
import ApiService from 'src/services/api';

export default {
  components: {},
  setup() {
    const $q = useQuasar();
    const dados = ref({
      nome: "",
      email: "",
    });
    const carregando = ref(false);
    const usuarioId = ref("");
    const fotoUsuario = ref("");

    // Carrega foto do localStorage
    const usuarioLocal = localStorage.getItem('usuario');
    if (usuarioLocal) {
      const usuario = JSON.parse(usuarioLocal);
      fotoUsuario.value = usuario.foto || "";
    }

    // Carrega dados do usuário ao montar o componente
    async function carregarDados() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          $q.notify({
            message: 'Você precisa fazer login',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        // Chama GET /api/usuarios/me usando o serviço
        const resposta = await ApiService.usuario.obterDados();

        if (resposta.data.sucesso) {
          dados.value.nome = resposta.data.usuario.nome;
          dados.value.email = resposta.data.usuario.email;
          usuarioId.value = resposta.data.usuario.id;

          console.log('Dados do usuário carregados:', resposta.data.usuario);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);

        if (error.response?.status === 401) {
          $q.notify({
            message: 'Sessão expirada. Faça login novamente.',
            color: 'negative',
            icon: 'error'
          });
        } else {
          $q.notify({
            message: 'Erro ao carregar seus dados',
            color: 'negative',
            icon: 'error'
          });
        }
      }
    }

    // Atualiza dados do usuário
    async function atualizarDados() {
      try {
        carregando.value = true;

        // Validações básicas
        if (!dados.value.nome || dados.value.nome.trim().length < 2) {
          $q.notify({
            message: 'Nome deve ter pelo menos 2 caracteres',
            color: 'warning',
            icon: 'warning'
          });
          return;
        }

        if (!dados.value.email || !dados.value.email.includes('@')) {
          $q.notify({
            message: 'Email inválido',
            color: 'warning',
            icon: 'warning'
          });
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          $q.notify({
            message: 'Você precisa fazer login',
            color: 'negative',
            icon: 'error'
          });
          return;
        }

        // Chama PUT /api/usuarios/me usando o serviço
        const resposta = await ApiService.usuario.atualizar({
          nome: dados.value.nome,
          email: dados.value.email
        });

        if (resposta.data.sucesso) {
          // Atualiza localStorage com novos dados
          const usuarioAtualizado = {
            id: usuarioId.value,
            nome: resposta.data.usuario.nome,
            email: resposta.data.usuario.email,
            foto: resposta.data.usuario.foto
          };
          localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

          $q.notify({
            message: 'Dados atualizados com sucesso!',
            color: 'positive',
            icon: 'check_circle'
          });

          console.log('Dados atualizados:', resposta.data.usuario);
        }
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);

        if (error.response?.status === 401) {
          $q.notify({
            message: 'Sessão expirada. Faça login novamente.',
            color: 'negative',
            icon: 'error'
          });
        } else if (error.response?.status === 409) {
          $q.notify({
            message: 'Este email já está sendo usado por outra conta',
            color: 'negative',
            icon: 'error'
          });
        } else {
          $q.notify({
            message: error.response?.data?.erro || 'Erro ao atualizar dados',
            color: 'negative',
            icon: 'error'
          });
        }
      } finally {
        carregando.value = false;
      }
    }

    // Carrega dados ao montar
    onMounted(() => {
      carregarDados();
    });

    return {
      dados,
      carregando,
      fotoUsuario,
      atualizarDados,
    };
  },
};
</script>
<style scoped>
.meus-dados-page {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.dados-container {
  background-color: #fee2b4;
  flex: 1;
  margin: 15px;
  margin-top: 0;
  border-radius: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  max-height: calc(100vh - 85px);
}

.dados-content {
  padding: 20px;
}

.avatar-icon {
  border-radius: 50%;
  padding: 15px;
  background-color: rgba(227, 221, 221, 0.981);
}
</style>
