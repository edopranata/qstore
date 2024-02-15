import {defineStore} from 'pinia'
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const useInvoicePrintStore = defineStore('invoicePrint', {
  state: () => ({
    invoice: {
      data: null
    }
  }),

  getters: {
    getInvoiceData(state) {
      return state.invoice.data
    },
    getSumDOTransaction(state){
      const data = {}
      data.loan = state.invoice.data ? state.invoice.data.loan ? 5 : 0 : 0
      data.detail = state.invoice.data ? state.invoice.data.detail_do ? state.invoice.data.detail_do.length + 2 : 0 : 0
      data.detail_trade = state.invoice.data ? state.invoice.data.detail_trades ? state.invoice.data.detail_trades.length + 2 : 0 : 0

      data.needed_length = data.loan + data.detail + data.detail_trade

      data.total = state.invoice.data ? state.invoice.data.detail_do ? state.invoice.data.detail_do.reduce((total, next) => total + next.customer_total, 0) : 0 : 0
      data.count = (14 - data.needed_length) >= 0 ? (14 - data.needed_length) : 1
      data.total_trading = state.invoice.data ? state.invoice.data.detail_trades ? state.invoice.data.detail_trades.reduce((total, next) => total + next.total, 0) : 0 : 0

      return data
    },
    getSummaries(state){
      const data = {}
      data.total_do = state.invoice.data ? state.invoice.data.detail_do ? state.invoice.data.detail_do.reduce((total, next) => total + next.customer_total, 0) : 0 : 0
      data.loan = state.invoice.data ? state.invoice.data.loan ? state.invoice.data.loan.credit !== 0 ? state.invoice.data.loan.credit : state.invoice.data.loan.debit : 0 : 0
      data.total_trading = state.invoice.data ? state.invoice.data.detail_trades ? state.invoice.data.detail_trades.reduce((total, next) => total + next.total, 0) : 0 : 0

      const sumaries = []
      sumaries.push(state.invoice.data ? state.invoice.data.detail_do ? state.invoice.data.detail_do.reduce((total, next) => total + next.customer_total, 0) : 0 : 0)
      sumaries.push(state.invoice.data ? state.invoice.data.detail_trades ? state.invoice.data.detail_trades.reduce((total, next) => total + next.total, 0) : 0 : 0)
      sumaries.push(state.invoice.data ? state.invoice.data.loan ? state.invoice.data.loan.credit !== 0 ? state.invoice.data.loan.credit : state.invoice.data.loan.debit : 0 : 0)

      return sumaries.reduce((total, sum) => total + sum)
    }
  },

  actions: {
    setError(e) {
      if(e.hasOwnProperty('response')){
        if (e.response.status === 422) {
          let error = e.response.data.errors;
          for (let property in error) {
            this.errors[property] = error[property][0];
          }
        }else if (e.response.status === 401) {
          LocalStorage.remove('token')
          LocalStorage.remove('permission')
          this.router.replace({name: 'unauthorized'})
        } else {
          this.errors = {};
          Notify.create({
            position: "top",
            type: 'negative',
            message: e.message ?? e.response.statusText
          })
          this.router.replace({name: 'app.unauthorized'})
        }
      }else{
        Notify.create({
          position: "top",
          type: 'negative',
          message: 'Unknown error'
        })
      }
    },
    async getInvoiceDataFromApi(path) {
      try {
        const response = await api.get(path)
        this.invoice.data = response.data.data
      } catch (e) {
        this.setError(e)
      }
    }
  }
})
