<template>
  <div
    style="
      margin-left: 5vw;
      margin-right: 5vw;
      margin-top: 10vh;
      background-color: #fee2b4;
      width: 90vw;
      height: 60vh;
    "
  >
    <div
      class="col-12 flex flex-center text-primary text-center text-bold text-h6 q-py-md"
    >
      <div style="margin-top: 5vh">UFA! É bom ter você aqui!</div>
    </div>
    <div class="col-12 flex flex-center q-pa-lg">
      <q-img src="images/feliz.png" style="max-width: 50vw; max-height: 50vh" />
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
