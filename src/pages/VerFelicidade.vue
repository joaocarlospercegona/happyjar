<template>
  <q-page>
    <div class="ver-felicidade-page">
      <div class="momento-card">
        <div class="input-container">
          <div class="col-12">
            <q-input
              class="col-12"
              v-model="momentoAleatorio"
              outlined
              type="textarea"
              label="Hoje fiquei feliz quando..."
              readonly
              :loading="carregando"
            />
          </div>
          <div class="col-12 q-py-lg">
            <q-btn
              class="full-width"
              color="primary"
              label="Ver mais uma!"
              dense
              no-caps
              @click="buscarMomentoAleatorio"
              :loading="carregando"
            />
          </div>
          <div class="col-12">
            <q-btn
              class="full-width"
              color="white"
              text-color="primary"
              label="Chega, pode fechar"
              dense
              no-caps
              flat
              @click="fechar"
            />
          </div>
        </div>
      </div>
      <div class="logo-container">
        <q-img src="images/logo horizontal.png" class="logo-image" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import ApiService from "src/services/api";

export default defineComponent({
  name: "VerFelicidade",
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    const momentoAleatorio = ref("");
    const carregando = ref(false);

    async function buscarMomentoAleatorio() {
      try {
        carregando.value = true;

        const resposta = await ApiService.momentos.aleatorio();
        console.log("Resposta do momento aleatório:", resposta);
        if (resposta.data.sucesso && resposta.data.momento) {
          momentoAleatorio.value = resposta.data.momento.texto;
        } else {
          $q.notify({
            message: "Você ainda não tem momentos felizes registrados!",
            color: "warning",
            icon: "info",
          });
          momentoAleatorio.value = "Comece a registrar seus momentos felizes para vê-los aqui depois!";
        }
      } catch (error) {
        console.error("Erro ao buscar momento:", error);

        // Verifica se é erro de conexão
        const isConnectionError =
          !error.response ||
          error.code === "ERR_NETWORK" ||
          error.code === "ERR_CONNECTION_REFUSED";

        if (isConnectionError) {
          $q.notify({
            message: "Backend offline. Não é possível buscar momentos.",
            color: "warning",
            icon: "info",
          });
        } else if (error.response?.status === 404) {
          momentoAleatorio.value = "Você ainda não tem momentos felizes registrados!";
        } else {
          $q.notify({
            message: "Erro ao buscar momento. Tente novamente.",
            color: "negative",
            icon: "error",
          });
        }
      } finally {
        carregando.value = false;
      }
    }

    function fechar() {
      router.push("/momento");
    }

    // Busca um momento aleatório ao carregar a página
    onMounted(() => {
      buscarMomentoAleatorio();
    });

    return {
      momentoAleatorio,
      carregando,
      buscarMomentoAleatorio,
      fechar,
    };
  },
});
</script>

<style scoped>
.ver-felicidade-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  padding-bottom: 250px;
  overflow: hidden;
}

.momento-card {
  background-color: #fee2b4;
  border-radius: 10px;
  padding: 30px 20px;
  flex: 0 0 auto;
}

.input-container {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
}

.logo-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  padding-bottom: 40px;
}

.logo-image {
  width: 200px;
  max-width: 70vw;
}
</style>
