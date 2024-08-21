<template>
  <q-layout class="flex flex-center">
    <div
      class="q-pa-md row justify-between"
      style="
        margin-top: -20vh;
        margin-left: 5vw;
        margin-right: 5vw;
        background-color: #fee2b4;
        width: 90vw;
        height: 40vh;
      "
    >
      <div
        class="col-12 flex flex-center text-center text-primary text-bold text-h6"
      >
        Como você se sente no agora?
      </div>
      <div class="col-4 flex flex-center q-pa-sm">
        <q-img
          :src="
            escolhido == 1 ? 'images/triste.png' : 'images/tristeEscuro.svg'
          "
          style="max-width: 50vw; max-height: 50vh"
          @click="escolhido = 1"
        />
      </div>
      <div class="col-4 flex flex-center q-pa-sm">
        <q-img
          :src="escolhido == 2 ? 'images/normal.png' : 'images/felizEscuro.svg'"
          style="max-width: 50vw; max-height: 50vh"
          @click="escolhido = 2"
        />
      </div>
      <div class="col-4 flex flex-center q-pa-sm">
        <q-img
          :src="
            escolhido == 3 ? 'images/feliz.png' : 'images/MaravilhosoEscuro.svg'
          "
          style="max-width: 50vw; max-height: 50vh"
          @click="escolhido = 3"
        />
      </div>
      <div class="col-12 q-py-lg q-gutter-y-sm">
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
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "EssentialLink",
  setup(props, context) {
    const router = useRouter();
    const escolhido = ref(0);
    async function salvarSentimento() {
      console.log("to aq");
      context.emit("voltarInicio", 1);
    }
    return {
      escolhido,
      salvarSentimento,
    };
  },
});
</script>
