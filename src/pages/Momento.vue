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

export default {
  components: {
    GravarMomento,
    SucessoMomento,
    FalhaMomento,
    SentimentoMomento,
  },
  setup() {
    const step = ref(1);
    async function voltarInicio(val) {
      step.value = 1;
    }
    async function salvarMomento(texto) {
      //mandar requisição para o back
      console.log("texto", texto);
      var randNumber = Math.random();
      var chance = 0.1;
      var interval = 0.1;
      if (randNumber <= (chance += interval)) {
        console.log("abrir o modal sentimento moemento");
        step.value = 4;
      } else {
        step.value = 2;
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
