<template>
  <q-page>
    <ApagarDados v-if="step == 1" />
    <ConfirmarApagarDados v-else-if="step == 2" />
    <DesistiuApagarDados v-else-if="step == 3" />
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
    return {
      step: ref(3),
      dados: ref({
        nome: "",
      }),
    };
  },
};
</script>
<style scoped></style>
