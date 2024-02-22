import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useCarRecapPrintStore = defineStore('carRecapPrint', {
  state: () => ({
    form: {
      type: 'Monthly',
      period_start: null,
      period_end: null,
      monthly: null,
      annual: null,
      car_id: [],
    },
    select: {
      selected_cars: [],
      cars: [],
      cars_option: [],
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
    getCarId(state) {
      return state.form.car_id.map(e => e)
    },
    getReportOptions(state) {
      return state.reportOptions
    },
    getTypeChange(state) {
      return state.form.type
    },
    getSelectedCars(state) {
      return state.select.selected_cars ? state.select.selected_cars.map(({id}) => id) : []
    },
    getSummaries(state) {
      let data = {}
      data.plantation = state.table.data ? state.table.data.reduce((total, next) => total + next.plantation, 0) : 0
      data.trading = state.table.data ? state.table.data.reduce((total, next) => total + next.trading, 0) : 0
      data.cost = state.table.data ? state.table.data.reduce((total, next) => total + next.cost, 0) : 0
      data.bruto = data.plantation + data.trading
      data.netto = data.bruto - data.cost

      return data;
    },
  },

  actions: {
    onReset() {
      for (let property in this.form) {
        if (property !== 'type') {
          this.form[property] = null
          if (property === 'car_id') {
            this.form[property] = []
            this.select.selected_cars = []
          }
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
          if (response.data.cars.length > 0) {
            console.log(response.data)
            this.table.data = response.data.cars
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
