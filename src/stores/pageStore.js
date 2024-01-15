import { defineStore } from 'pinia';

export const usePageStore = defineStore('page', {
  state: () => ({
    leftDrawer: false,
    rightDrawer: false,
    menus: []
  }),
  actions: {
    toggleLeftDrawer() {
      this.leftDrawer = !this.leftDrawer
    },
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },
  }
});
