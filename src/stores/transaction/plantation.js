import {defineStore} from 'pinia'
import {reactive} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const usePlantationsStore = defineStore('plantation', {
  state: () => ({
    form: {
      id: '',
      trade_date: '',
      net_weight: '',
      net_price: '',
      trade_cost: '',
      car_id: '',
      driver_id: '',
      land_id: [],
    },
    areas: [],
    selected_lands: [],
    lands: [],
    lands_option: [],
    drivers: [],
    drivers_option: [],
    selected_driver: null,
    cars: [],
    cars_option: [],
    selected_car: null,
    table: {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      selected: [],
      filter: '',
      search: {},
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal Transaksi", field: "trade_date", sortable: true, align: 'left'},
        {name: "driver_name", label: "Nama Supir / Mobil", field: "driver_name", sortable: false, align: 'left'},
        {name: "trade_cost", label: "Uang Jalan (Rp)", field: "trade_cost", sortable: true},
        {name: "net_price", label: "Harga (Rp)", field: "net_price", sortable: true},
        {name: "net_weight", label: "Tonase (kg)", field: "net_weight", sortable: true},
        {name: "net_total", label: "Total (Rp)", field: "net_total", sortable: true},
        {name: "wide_total", label: "Luas Lahan (Ha)", field: "wide_total", sortable: true},
        {name: "trees_total", label: "Jumlah Pohon (Btg)", field: "trees_total", sortable: true},
        {name: "created_by", label: "User", field: "created_by", sortable: false, align: 'left'},
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
    getSelectedLands(state) {
      return state.selected_lands ? state.selected_lands.map(({id}) => id) : []
    },
    getSelectedCar(state) {
      return state.selected_car
    },
    getSelectedDriver(state) {
      return state.selected_driver
    },
    getLandsOption(state) {
      state.lands_option = []
      let temp = {}
      state.areas.forEach(area => {
        area?.lands.forEach(land => {
          temp = land
          temp.area = area.name
          state.lands_option.push(temp)
          state.lands.push(temp)
        })
      })

      return state.lands_option
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
    },
    unsetError(error) {
      if (this.errors.hasOwnProperty(error)) {
        delete this.errors[error]
      }
    },
    onReset() {
      for (let property in this.form) {
        this.form[property] = null
        if (property === 'car_id' || property === 'driver_id' || property === 'land_id') {
          this.selected_car = null
          this.selected_driver = null
          this.selected_lands = null
        }
      }
      this.errors = {}
      this.table.selected = []

    },
    async getPlantationDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
      // data.name = this.table.search.name ?? ''
      // data.user = this.table.search.user ?? ''
      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },
    async getPlantationData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getPlantationDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.plantations?.data
      this.drivers = returnedData.drivers
      this.drivers_option = returnedData.drivers?.slice(0, 10)

      this.cars = returnedData.cars
      this.cars_option = returnedData.cars?.slice(0, 10)

      this.areas = returnedData.areas.data
      // update only rowsNumber = total rows
      this.table.pagination.rowsNumber = returnedData.plantations?.meta.total

      // don't forget to update local pagination object
      this.table.pagination.page = page
      this.table.pagination.rowsPerPage = rowsPerPage
      this.table.pagination.sortBy = sortBy
      this.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.table.loading = false
      return true
    },
    async submitForm(path) {
      this.table.loading = true
      const params = this.form;

      const url = this.form.id ? `${path}/${this.form.id}` : path
      await api({
        method: this.form.id ? 'patch' : 'post',
        url: url,
        data: params
      }).then(() => {
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.hasOwnProperty('id') ? 'Data transaksi berhasil diubah' : 'Data transaksi berhasil disimpan'
        })
        this.table.filter = String(Date.now())
        this.table.selected = []
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
            message: 'Transaksi berhasil dihapus'
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
