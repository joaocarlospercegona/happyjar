<template>
  <q-page>
    <ApagarDados v-if="step == 1" @mudarStep="mudarStep" />
    <ConfirmarApagarDados v-else-if="step == 2" @mudarStep="mudarStep" />
    <DesistiuApagarDados v-else-if="step == 3" @mudarStep="mudarStep" />
  </q-page>
</template>
<script>
import { ref } from "vue";
import ApagarDados from "components/ApagarDados.vue";
import ConfirmarApagarDados from "components/ConfirmarApagarDados.vue";
import DesistiuApagarDados from "components/DesistiuApagarDados.vue";
("");
export default {
  components: { ApagarDados, ConfirmarApagarDados, DesistiuApagarDados },
  setup() {
    const step = ref(1);
    async function mudarStep(val) {
      step.value = val;
    }
    return {
      mudarStep,
      step,
      dados: ref({
        nome: "",
      }),
    };
  },
};
</script>
<style scoped></style>
