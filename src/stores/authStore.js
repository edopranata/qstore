import {defineStore} from 'pinia';
import {api} from 'boot/axios'
import {LocalStorage, Notify} from 'quasar'
import {usePageStore} from "stores/helper/pageStore";

const usePage = usePageStore()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    permissions: [],
    errors: {}
  }),
  getters: {
    authenticated() {
      return !!this.token
    },
  },

  actions: {
    can(permissionName) {
      let permissions = LocalStorage.has('permissions') ? LocalStorage.getItem('permissions') : []

      // console.log(permissions)
      if(permissionName.endsWith('*')){
        let contains = permissions.filter(filtered => filtered.startsWith(permissionName.replace('*', '')))
        return contains.length > 0
      }else if (permissionName.endsWith(']')){
        let first = permissionName.substring(0, permissionName.indexOf("["))
        let only = permissionName.substring(
          permissionName.indexOf("[") + 1,
          permissionName.lastIndexOf("]")
        );
        let access = []
        let split = only.replace(' ', '').split(',')
        for (let i in split){
          if(permissions.includes(first + split[i])){
            access.push(first + split[i])
          }
        }
        return access.length > 0
      }else{
        return permissions.includes(permissionName)
      }
    },
    isError(property) {
      return this.errors.hasOwnProperty(property)
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
    setAuthenticated(data, token) {
      if (data && token) {
        const permissions = data.routes
        // const menu = data.menu
        // const user = data.user

        // set token to pinia and local storage
        LocalStorage.set('token', token)
        this.token = token

        // set user to pinia and local storage
        // LocalStorage.set('user', user)
        this.user = data.user

        // set permissions to pinia and local storage
        // LocalStorage.set('permissions', permissions)
        this.permissions = permissions
        LocalStorage.set('permissions', permissions)

        // set menu to pinia and local storage
        // LocalStorage.set('menu', menu)
        usePage.menus = data.menu
        usePage.setting = data.setting
      }

    },
    unsetAuthenticated() {
      // const menu = data.menu
      // const user = data.user

      // set token to pinia and local storage
      LocalStorage.remove('token')
      LocalStorage.remove('permissions')

      // set user to pinia and local storage
      // LocalStorage.set('user', user)
      this.user = null

      // set permissions to pinia and local storage
      // LocalStorage.set('permissions', permissions)
      this.permissions = null

      // set menu to pinia and local storage
      // LocalStorage.set('menu', menu)
      usePage.menus = null
      usePage.setting = {}

    },
    async attempt(token) {
      try {
        let response = await api.post("/user");
        await this.setAuthenticated(response.data.data, token)
        return response;
      } catch (e) {
        await this.unsetAuthenticated()
        throw e
      }
    },

    async login(path, data) {
      try {
        let response = await api.post(path, data)
        let token = response.data.token
        let type = response.data.type

        api.defaults.headers.common.Authorization = `${type} ${token}`

        await this.attempt(token);

      } catch (e) {
        this.setErrors(e)
      }
    },

  }
});
