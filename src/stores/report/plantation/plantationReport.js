import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const usePlantationReportStore = defineStore('plantationReport', {
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
      {label: 'Tahunan', value: 'Annual'}
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
    unsetError(name = null){
      if(name){
        delete this.errors[name]
      }else{
        for (let property in this.errors){
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
