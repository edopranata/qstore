import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useCarCostStore = defineStore('carCost', {
  state: () => ({
    form: {
      edit: false,
      id: null,
      cost_type_id: '',
      car_id: '',
      trade_date: '',
      description: '',
      amount: '',
    },

    select: {
      cost_type: [],
      cost_type_option: [],
      selected_cost_type: [],

      cars: [],
      cars_option: [],
      selected_car: null,
    },
    table: {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      search: {
        no_pol: '',
        cost_type_id: '',
        description: '',
      },
      from: 0,
      selected: ref([]),
      filter: '',
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal", field: "trade_date", sortable: true, align: 'left'},
        {name: "subject", label: "Mobil", field: 'subject', sortable: false, align: 'left'},
        {name: "cost_type", label: "Jenis Biaya", field: 'cost_type', sortable: true, align: 'left'},
        {name: "description", label: "Keterangan", field: 'description', sortable: true, align: 'left'},
        {name: "amount", label: "Jumlah Biaya (Rp)", field: 'amount', sortable: true, align: 'right'},
        {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected
    },
    getSelectedCar(state){
      return state.select.selected_car
    },
    getSelectedCostType(state){
      return state.select.selected_cost_type
    }
  },

  actions: {
    onReset(name = null) {
      if (!name) {
        for (let property in this.form) {
          this.form[property] = null
          this.errors = {}
          if (property === 'car_id') {
            this.select.selected_car = null
          }
          if (property === 'cost_type_id') {
            this.select.selected_cost_type = null
          }
          if(property === 'edit'){
            this.form.edit = false
          }
        }
        this.table.selected = []
      } else {
        this.form[name] = null
        delete this.errors[name]
        if (name === 'car_id') {
          this.select.selected_car = null
        }
        if(name === 'cost_type_id'){
          this.select.selected_cost_type = null
        }
      }
    },
    unsetError (name){
      delete this.errors[name]
    },
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
    async getCarCostDataFromApi(path, startRow, count, filter, sortBy, descending) {
      const data = {
        page: startRow,
        limit: count,
      }

      // Sort by field descending or ascending
      if (sortBy) {
        const orderBy = descending ? 'desc' : 'asc'
        data.sortBy = JSON.stringify({
          key: sortBy,
          order: orderBy
        })
      }
      // search
      data.no_pol = this.table.search.no_pol ?? ''
      data.cost_type_id = this.table.search.cost_type_id ?? ''
      data.description = this.table.search.description ?? ''
      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },
    async getCarCostData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getCarCostDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.data

      // update only rowsNumber = total rows
      this.table.pagination.rowsNumber = returnedData.meta.total

      // don't forget to update local pagination object
      this.table.pagination.page = page
      this.table.pagination.rowsPerPage = rowsPerPage
      this.table.pagination.sortBy = sortBy
      this.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.table.loading = false
      return true
    },

    async loadAllCars(path) {
      try {
        const response = await api.get(path)
        this.select.cars = response.data.cars
        this.select.cost_type = response.data.cost_type
      } catch (e) {
        this.setError(e)
      }
    },

    async submitForm(path) {
      this.table.loading = true
      const params = this.form;

      const url = this.form.edit ? `${path}/${this.form.id}` : path
      await api({
        method: this.form.edit ? 'patch' : 'post',
        url: url,
        data: params
      }).then(() => {
        this.table.selected = []
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.hasOwnProperty('id') ? 'Data biaya berhasil diubah' : 'Data biaya berhasil disimpan'
        })
        this.table.filter = String(Date.now())
        this.onReset()
      }).catch(e => {
        this.setError(e);
      }).finally(() => this.table.loading = false);
    },

    async submitDelete(path = '/') {
      this.table.loading = true
      await api.delete(path + "/" + this.table.selected[0].id)
        .then(() => {
          Notify.create({
            position: "top",
            type: 'positive',
            message: 'Data biaya berhasil dihapus'
          })
          this.table.filter = String(Date.now())
          this.table.selected = []
          this.onReset()
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
  }
})
