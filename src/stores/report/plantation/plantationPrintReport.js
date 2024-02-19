import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const usePlantationPrintStore = defineStore('plantationPrint', {
  state: () => ({
    form: {
      type: 'Period',
      period_start: null,
      period_end: null,
      monthly: null,
      annual: null,
    },
    table: {
      data: [],
      loading: false,
    },
    errors: {},
  }),

  getters: {
    getAllData(state) {
      return state.table.data ?? []
    },
    getSummaries(state) {
      let data = {}
      data.tonase = state.table.data ? state.table.data.reduce((total, next) => total + next.net_weight, 0) : 0
      data.price = state.table.data ? state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + next.net_price, 0) / state.table.data.length : 0 : 0
      data.trade_cost = state.table.data ? state.table.data.reduce((total, next) => total + next.trade_cost, 0) : 0
      data.car_fee = state.table.data ? state.table.data.reduce((total, next) => total + (next.net_weight * next.car_fee), 0) : 0
      data.driver_fee = state.table.data ? state.table.data.reduce((total, next) => total + (next.net_weight * next.driver_fee), 0) : 0
      data.cost = data.trade_cost + data.driver_fee + data.car_fee
      data.bruto = state.table.data ? state.table.data.reduce((total, next) => total + next.net_total, 0) : 0
      data.netto = state.table.data ? state.table.data.reduce((total, next) => total + next.net_income, 0) : 0
      return data;
    }
  },

  actions: {

    setError(e) {
      if (e.response.status === 422) {
        let error = e.response.data.errors;
        for (let property in error) {
          this.errors[property] = error[property][0];
        }
      } else {
        this.errors = {};
        Notify.create({
          position: "top",
          type: 'negative',
          message: e.message ?? e.response.statusText
        })
        if (e.response.status === 401) {
          LocalStorage.remove('token')
          LocalStorage.remove('permission')
          this.router.push({name: 'unauthorized'})
        }
      }
      this.table.loading = false
    },
    async getReportData(path) {
      this.table.loading = true
      const data = {}
      for (let property in this.form) {
        if(this.form[property]){
          data[property] = this.form[property]
        }
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        if(response.data.plantations.length > 0 ){
          this.table.data = response.data.plantations
        }else {
          Notify.create({
            position: "top",
            type: 'info',
            message: 'No record found'
          })
          this.table.data = []
        }
        this.table.loading = false
      } catch (e) {
        this.setError(e)
      }
    },

  }
})
