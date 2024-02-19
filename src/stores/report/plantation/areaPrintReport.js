import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useLandPrintStore = defineStore('landPrint', {
  state: () => ({
    form: {
      type: 'Period',
      period_start: null,
      period_end: null,
      monthly: null,
      annual: null,
      land_id: [],
    },
    table: {
      data: [],
      lands: [],
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
      data.wide = state.table.data ? state.table.data.reduce((total, next) => total + next.wide, 0) : 0
      data.trees = state.table.data ? state.table.data.reduce((total, next) => total + next.trees, 0) : 0
      data.trade_cost = state.table.data ? state.table.data.reduce((total, next) => total + next.trade_cost, 0) : 0
      data.driver_cost = state.table.data ? state.table.data.reduce((total, next) => total + next.driver_cost, 0) : 0
      data.car_cost = state.table.data ? state.table.data.reduce((total, next) => total + next.car_cost, 0) : 0
      data.cost = state.table.data ? state.table.data.reduce((total, next) => total + next.cost, 0) : 0
      data.net_weight = state.table.data ? state.table.data.reduce((total, next) => total + next.net_weight, 0) : 0
      data.net_price = state.table.data ? state.table.data.reduce((total, next) => total + next.net_price, 0) : 0
      data.bruto = state.table.data ? state.table.data.reduce((total, next) => total + next.bruto, 0) : 0
      data.netto = state.table.data ? state.table.data.reduce((total, next) => total + next.netto, 0) : 0
      data.avg_wide = state.table.data ? state.table.data.reduce((total, next) => total + next.avg_wide, 0) : 0
      data.avg_tree = state.table.data ? state.table.data.reduce((total, next) => total + next.avg_tree, 0) : 0
      data.avg_wide_weight = state.table.data ? state.table.data.reduce((total, next) => total + next.avg_wide_weight, 0) : 0
      data.avg_tree_weight = state.table.data ? state.table.data.reduce((total, next) => total + next.avg_tree_weight, 0) : 0
      data.avg_cost = state.table.data ? state.table.data.reduce((total, next) => total + next.avg_cost, 0) : 0

      return data;
    }
  },

  actions: {
    setSummaries(response){
      let data = {}
      response.forEach(item => {
        data = {}
        data = this.calculateAvgCost(item)
        data.trade_date = item.plantation.trade_date
        data.name = item.land.name
        data.area = item.land.area

        this.table.data.push(data)
      })
    },
    calculateAvgCost(detail) {
      const data = {}
      data.wide = parseFloat(detail.wide)
      data.trees = parseFloat(detail.trees)
      data.trade_cost = parseFloat(detail.plantation.trade_cost)
      data.driver_cost = parseFloat(detail.plantation.driver_fee) * parseFloat(detail.plantation.net_weight)
      data.car_cost = parseFloat(detail.plantation.car_fee) * parseFloat(detail.plantation.net_weight)
      data.cost = data.trade_cost + data.driver_cost + data.car_cost

      data.net_weight = parseFloat(detail.plantation.net_weight)
      data.net_price = parseFloat(detail.plantation.net_price)

      data.bruto = (parseFloat(detail.plantation.net_total) / parseFloat(detail.plantation.wide_total)) * data.wide
      data.netto = (parseFloat(detail.plantation.net_income) / parseFloat(detail.plantation.wide_total)) * data.wide

      data.avg_wide = (data.net_weight / parseFloat(detail.plantation.wide_total))
      data.avg_tree = (data.net_weight / parseFloat(detail.plantation.trees_total))

      data.avg_wide_weight = (data.net_weight / parseFloat(detail.plantation.wide_total)) * data.wide
      data.avg_tree_weight = (data.net_weight / parseFloat(detail.plantation.trees_total)) * data.trees
      data.avg_cost = (data.cost / parseFloat(detail.plantation.wide_total)) * data.wide

      return data

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
      const data = {}
      for (let property in this.form) {
        if (this.form[property]) {
          if(property === 'land_id'){
            data[property]  = this.form[property].map(e => e)

          }else{
            data[property] = this.form[property]
          }
        }
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        if (response.data.lands.length > 0) {
          // this.table.data = response.data.lands
          this.setSummaries(response.data.lands)
        } else {
          Notify.create({
            position: "top",
            type: 'info',
            message: 'No record found'
          })
          this.table.data = []
        }
        this.table.loading = false
      } catch (e) {
        console.log(e)
        this.setError(e)
      }
    },

  }
})
