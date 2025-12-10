<template>
  <div
    style="margin: 5vw; background-color: #fee2b4; width: 90vw; height: 80vh"
  >
    <div
      class="col-12 flex flex-center text-primary text-center text-bold text-h6 q-py-md"
    >
      Isso aqui vai apagar sua conta e todas suas felicidades que você guardou
      aqui!
    </div>
    <div class="col-12 flex flex-center">
      <q-img
        src="images/depressao.png"
        style="max-width: 60vw; max-height: 50vh"
      />
    </div>
    <div
      class="col-12 flex flex-center text-primary text-center text-bold text-h6 q-py-sm"
    >
      Você quer fazer isso mesmo ?
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
        label="Sim, quero sair daqui"
        color="primary"
        outline
        no-caps
        dense
        @click="$emit('mudarStep', 2)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ApagarDados",
  emits: ['mudarStep'],
});
</script>
