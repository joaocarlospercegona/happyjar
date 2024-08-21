<template>
  <q-page>
    <div
      style="margin: 5vw; background-color: #fee2b4; width: 90vw; height: 80vh"
    >
      <div class="row justify-start q-px-lg">
        <div class="col-4">
          <q-icon
            name="person"
            color="grey"
            text-color="primary"
            size="lg"
            style="
              border-radius: 50px 50px 50px 50px;
              padding: 15px;
              background-color: rgba(227, 221, 221, 0.981);
              margin-top: 15px;
              margin-right: 20px;
            "
            @click="toggleDrawer"
          />
        </div>
        <div class="col-8 flex flex-center" style="margin-top: 15px">
          <q-btn
            class="full-width"
            color="primary"
            label="Alterar"
            icon="fas fa-save"
            dense
            no-caps
          />
        </div>
        <div class="col-12 q-py-lg">
          <div>
            <span class="text-primary">Nome</span>
            <q-input
              v-model="dados.nome"
              placeholder="Felisberto da Silva"
              dense
              outlined
              color="primary"
              label-color="primary"
              bg-color="white"
            />
          </div>
          <div class="q-py-md">
            <span class="text-primary">E-mail</span>
            <q-input
              v-model="dados.nome"
              placeholder="Felisberto da Silva"
              dense
              outlined
              color="primary"
              label-color="primary"
              bg-color="white"
            />
          </div>
          <div class="q-py-md">
            <q-btn
              color="primary"
              label="Atualizar Dados"
              class="full-width"
              no-caps
            />
          </div>
          <div class="q-py-lg">
            <q-separator color="primary" size="2px" />
          </div>
          <div class="text-primary text-h6 text-center">Zona do Perigo</div>
          <div class="text-primary text-h6 text-center q-py-lg">
            <q-btn
              label="Apagar os Meus Dados"
              class="bg-white full-width"
              outline
              text-color="primary"
              dense
              no-caps
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { ref } from "vue";

export default {
  components: {},
  setup() {
    return {
      dados: ref({
        nome: "",
      }),
    };
  },
};
</script>
<style scoped></style>
