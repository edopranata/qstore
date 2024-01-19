import { defineStore } from 'pinia';
import {LocalStorage} from "quasar";

export const usePageStore = defineStore('page', {
  state: () => ({
    leftDrawer: false,
    rightDrawer: false,
    activeMenu: null,
    menus: []
  }),

  actions: {
    setActive(routeName) {
      LocalStorage.set('active', routeName)
      this.activeMenu = routeName
    },
    unsetActive(){
      LocalStorage.set('active', '')
      this.activeMenu = ''
    },
    toggleLeftDrawer() {
      LocalStorage.set('leftDrawer', !this.leftDrawer)
      this.leftDrawer = !this.leftDrawer
    },
    toggleRightDrawer() {
      this.rightDrawer = !this.rightDrawer
    },

  }
});
