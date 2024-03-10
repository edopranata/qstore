import {defineStore} from 'pinia';
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const usePageStore = defineStore('page', {
  state: () => ({
    leftDrawer: false,
    rightDrawer: false,
    activeMenu: null,
    menus: [],
    print: false,
    setting: {},
    default_setting: {},
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
    errors: {},
  }),

  getters: {
    getPrintStatus(state){
      return state.print
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
    setErrors(e) {
      if (e.response)
        if (e.response.status === 422) {
          let error = e.response.data.errors;
          for (let property in error) {
            this.errors[property] = error[property][0];
          }
        } else {
          Notify.create({
            type: 'negative',
            message: e.response.statusText
          })
          this.errors = {};
        }

    },
    async saveSetting() {
      let data = this.setting
      try {
        await api.post('/setting', data).then(response => {
          if(response.hasOwnProperty('settings')){
            Notify.create({
              position: 'top',
              type: 'positive',
              message: 'Pengaturan default tarif berhasil di update'
            })
            this.setting = data.settings
            this.default_setting = data.settings
            this.rightDrawer = false
          }
        }).catch(e => {
          throw e
        })

      } catch (e) {
        this.setErrors(e)
      }
    }

  }
});
