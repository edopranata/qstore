import {defineStore} from 'pinia';
import {LocalStorage} from "quasar";

export const usePageStore = defineStore('page', {
  state: () => ({
    leftDrawer: false,
    rightDrawer: false,
    activeMenu: null,
    menus: [],
    currencyFormat: {
      prefix: 'Rp ',
      suffix: '',
      reverseFill: false,
      min: undefined,
      max: undefined,
    },
    unitFormat: {
      prefix: '',
      suffix: ' kg',
      reverseFill: false,
      min: undefined,
      max: undefined,
    },
    price: {
      car_fee: 100,
      driver_fee: 80,
      trade_cost: 270000,
      margin: 40,
      factory: 2300
    },
  }),

  getters: {
    getDefaultPrice(state) {
      return state.price
    }
  },

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
