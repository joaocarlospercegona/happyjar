<template>
  <div class="sucesso-page">
    <div class="sucesso-card">
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

<style scoped>
.sucesso-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -60px;
  overflow: hidden;
}

.sucesso-card {
  background-color: #fee2b4;
  border-radius: 10px;
  padding: 30px 20px;
  width: 100%;
  max-width: 400px;
  text-align: center;
}
</style>
