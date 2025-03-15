// 📁 src/stores/positionStore.ts
import { defineStore } from "pinia";

export const usePositionStore = defineStore("position", {
  state: () => ({
    isPosition: "",
  }),
  actions: {
    setPosition(newPosition: string) {
      this.isPosition = newPosition;
    },
  },
});
