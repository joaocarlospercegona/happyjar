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
      />
    </div>
  </div>
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
});
</script>
