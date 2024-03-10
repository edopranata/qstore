import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useDriverLoanRecapReportStore = defineStore('driverLoanRecapReport', {
  state: () => ({
    form: {
      type: 'Monthly',
      monthly: null,
      annual: null,
    },
    reportOptions: [
      {label: 'Bulanan', value: 'Monthly'},
      {label: 'Tahunan', value: 'Annual'},
    ],
    table: {
      data: [],
      loading: false,
    },
    errors: {},
  }),

  getters: {
    getReportOptions(state) {
      return state.reportOptions
    },
    getTypeChange(state) {
      return state.form.type
    },
    getAllData(state){
      return state.table.data
    },
    getSummaries(state) {
      let data = {}

      data.count = parseFloat(state.table.data ? state.table.data.reduce((total, next) => parseFloat(total) + parseFloat(next.count), 0) : 0)
      data.debit = parseFloat(state.table.data ? state.table.data.reduce((total, next) => parseFloat(total) + parseFloat(next.debit), 0) : 0)
      data.credit = parseFloat(state.table.data ? state.table.data.reduce((total, next) => parseFloat(total) + parseFloat(next.credit), 0) : 0)

      return data;
    },
  },

  actions: {
    onReset() {
      for (let property in this.form) {
        if (property !== 'type') {
          this.form[property] = null
        }
      }
      this.errors = {}
    },
    unsetError(name = null) {
      if (name) {
        delete this.errors[name]
      } else {
        for (let property in this.errors) {
          delete this.errors[property]
        }
      }
    },
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
      const params = this.form

      try {
        await api.post(path, params).then(response => {
          if (response.data.length > 0) {
            this.table.data = response.data
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
