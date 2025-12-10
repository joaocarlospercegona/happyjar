<template>
  <div class="gravar-momento-page">
    <div class="momento-card">
      <div class="input-container">
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
    <div class="logo-container">
      <q-img src="images/logo horizontal.png" class="logo-image" />
    </div>
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

<style scoped>
.gravar-momento-page {
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
