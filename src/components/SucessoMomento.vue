<template>
  <q-layout class="flex flex-center">
    <div
      class="q-pa-md"
      style="
        background-color: #fee2b4;
        width: 90vw;
        height: 60vh;
        margin-top: -30vh;
      "
    >
      <div class="col-12 flex flex-center text-primary text-bold text-h6">
        Sua Felicidade está guardada!
      </div>
      <div class="col-12 flex flex-center">
        <q-img
          src="images/feliz.png"
          style="max-width: 70vw; max-height: 50vh"
        />
      </div>
      <div class="col-12 q-py-lg">
        <q-btn
          class="full-width"
          color="primary"
          label="Feito!"
          dense
          @click="confirmar()"
          no-caps
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "EssentialLink",
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },

    link: {
      type: String,
      default: "#",
    },

    icon: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    async function confirmar() {
      console.log("to aqui");
      context.emit("voltarInicio", 1);
    }
    return {
      confirmar,
    };
  },
});
</script>
