<template>
  <div
    class="row justify-center"
    style="
      margin-left: 5vw;
      margin-right: 5vw;
      margin-top: 15vh;
      background-color: #fee2b4;
      width: 90vw;
      height: 40vh;
    "
  >
    <div class="flex justify-center q-py-xl">
      <div
        class="row justify-center"
        style="width: 70vw; height: 21.5vh; background-color: white"
      >
        <div class="col-12">
          <q-input
            class="col-12"
            v-model="text"
            outlined
            type="textarea"
            label="Hoje fiquei feliz quando..."
          />
        </div>
        <div class="col-12 q-py-lg">
          <q-btn
            class="full-width"
            color="primary"
            label="Guardar a Felicidade"
            dense
            no-caps
            @click="salvarMomento"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="row justify-center flex flex-center justify-center q-py-xl">
    <q-img src="images/logo horizontal.png" style="width: 70vw" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
export default defineComponent({
  emits: ["salvarMomento"],
  setup(props, context) {
    const text = ref("");
    async function salvarMomento() {
      context.emit("salvarMomento", text.value);
    }
    return {
      text,
      salvarMomento,
    };
  },
});
</script>
