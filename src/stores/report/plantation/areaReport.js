import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useAreaReportStore = defineStore('areaReport', {
  state: () => ({
    form: {
      type: 'Period',
      period_start: null,
      period_end: null,
      monthly: null,
      annual: null,
      area_id: [],
    },
    select: {
      selected_areas: [],
      areas: [],
      areas_option: [],
    },
    reportOptions: [
      {label: 'Periode', value: 'Period'},
      {label: 'Bulanan', value: 'Monthly'},
      {label: 'Tahunan', value: 'Annual'}
    ],
    table: {
      data: [],
      loading: false,
    },
    errors: {},
  }),

  getters: {
    getAreaId(state){
      return state.form.area_id.map(e => e)
    },
    getReportOptions(state) {
      return state.reportOptions
    },
    getTypeChange(state) {
      return state.form.type
    },
    getSelectedAreas(state) {
      return state.select.selected_areas ? state.select.selected_areas.map(({id}) => id) : []
    },
  },

  actions: {
    calculateAvgCost(detail) {
      const data = {}
      data.wide = parseFloat(detail.wide)
      data.trees = parseFloat(detail.trees)
      data.trade_cost = parseFloat(detail.plantation.trade_cost)
      data.driver_cost = parseFloat(detail.plantation.driver_fee) * parseFloat(detail.plantation.net_weight)
      data.car_cost = parseFloat(detail.plantation.car_fee) * parseFloat(detail.plantation.net_weight)
      data.cost = data.trade_cost + data.driver_cost + data.car_cost

      data.net_weight = parseFloat(detail.plantation.net_weight)

      data.bruto = (parseFloat(detail.plantation.net_total) / parseFloat(detail.plantation.wide_total)) * data.wide
      data.netto = (parseFloat(detail.plantation.net_income) / parseFloat(detail.plantation.wide_total)) * data.wide


      data.avg_wide = (data.net_weight / parseFloat(detail.plantation.wide_total))
      data.avg_tree = (data.net_weight / parseFloat(detail.plantation.trees_total))

      data.avg_wide_weight = (data.net_weight / parseFloat(detail.plantation.wide_total)) * data.wide
      data.avg_tree_weight = (data.net_weight / parseFloat(detail.plantation.trees_total)) * data.trees
      data.avg_cost = (data.cost / parseFloat(detail.plantation.wide_total)) * data.wide

      return data

    },
    onReset() {
      for (let property in this.form) {
        if (property !== 'type') {
          this.form[property] = null
          if(property === 'area_id'){
            this.form[property] = []
            this.select.selected_areas = []
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
    async getAreaData(path) {
      this.select.areas_option = []
      this.select.areas = []
      this.table.loading = true
      const data = {
        type: 'index'
      }

      try {
        const params = new URLSearchParams(data);
        await api.get(path, {params}).then(response => {
          let temp = {}
          if (response.data.areas.length > 0) {
            let state = response.data.areas
            state.forEach(area => {
              area?.areas.forEach(area => {
                temp = area
                temp.area = area.name
                this.select.areas_option.push(temp)
                this.select.areas.push(temp)
              })
            })
          }
        }).finally( () => this.table.loading = false)

      } catch (e) {
        this.setError(e)
      }
    },

    async getReportData(path) {
      this.table.loading = true
      const data = {}
      for (let property in this.form) {
        if (this.form[property]) {
          if(property === 'area_id'){
            data[property]  = this.form[property].map(e => e)

          }else{
            data[property] = this.form[property]
          }
        }
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        if (response.data.areas.length > 0) {
          this.table.data = response.data.areas
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
        this.setError(e)
      }
    },

  }
})
