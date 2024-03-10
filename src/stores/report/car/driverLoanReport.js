import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useDriverLoanReportStore = defineStore('driverLoanReport', {
  state: () => ({
    table: {
      data: [],
      loading: false,
    },
    errors: {},
  }),

  getters: {
    getSummaries(state) {
      let data = {}
      data.balance = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.balance), 0) : 0)
      return data
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

      try {
        await api.post(path).then(response => {
          if (response.data.loans.length > 0) {
            this.table.data = response.data.loans
          } else {
            Notify.create({
              position: "top",
              type: 'info',
              message: 'No record found'
            })
            this.table.data = []
          }
        }).finally( () => this.table.loading = false)
      } catch (e) {
        this.setError(e)
      }
    },

  }
})
