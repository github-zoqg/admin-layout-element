import { defineStore } from 'pinia';

const useMainStore = defineStore('main', {
  state: () => {
    return {
      count: 0,
    };
  },
  getters: {
    doubleCount: (state) => {
      return state.count * 2;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});

export default useMainStore;
