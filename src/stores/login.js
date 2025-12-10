import { defineStore } from "pinia";

export const useLoginStore = defineStore({
  id: "login",
  state: () => ({
    login: {},
  }),
  persist: true,
  getters: {
    getLogin: (state) => {
      return {
        login: state.login,
      };
    },
  },
  actions: {
    setLogin(login) {
      this.login = login;
    },
  },
});
