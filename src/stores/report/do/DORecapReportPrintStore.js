import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useDORecapReportPrintStore = defineStore('DORecapReportPrint', {
  state: () => ({
    form: {
      type: 'Period',
      period_start: null,
      period_end: null,
      monthly: null,
      annual: null,
    },
    reportOptions: [
      {label: 'Periode', value: 'Period'},
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
    getSummaries(state) {
      let data = {}
      data.net_weight = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.net_weight), 0) : 0)
      data.net_price = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.net_price), 0) / parseFloat(state.table.data.length)  : 0)
      data.margin = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.margin), 0) / parseFloat(state.table.data.length) : 0)
      data.gross_total = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.gross_total), 0) : 0)
      data.net_total = parseFloat(state.table.data ? state.table.data.reduce((total, next) => total + parseFloat(next.net_total), 0) : 0)
      return data
    }
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
