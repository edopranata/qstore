import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useTradingsStore = defineStore('tradings', {
  state: () => ({
    parent: {
      form: {
        id: '',
        trade_date: '',
        trade_cost: '',
        car_id: '',
        driver_id: '',
      },
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
        selected: ref([]),
        filter: '',
        search: {},
        loading: false,
        headers: reactive([
          {name: "action", label: "Action", sortable: false, align: 'left'},
          {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
          {name: "trade_date", label: "Tanggal Transaksi", field: "trade_date", sortable: true, align: 'left'},
          {name: "driver_name", label: "Nama Supir / Mobil", field: "driver_name", sortable: false, align: 'left'},
          {name: "trade_cost", label: "Uang Jalan (Rp)", field: "trade_cost", sortable: true},
          {name: "customer_average_price", label: "Harga (Avg)", field: "customer_average_price", sortable: true},
          {name: "customer_total_price", label: "Total (Rp)", field: "customer_total_price", sortable: true},
          {name: "customer_total_weight", label: "Berat (kg)", field: "customer_total_weight", sortable: true},
          {name: "created_by", label: "User", field: "created_by", sortable: false, align: 'left'},
          {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
        ]),
        data: [],
      },
    },
    details: {},
    errors: {},
  }),

  getters: {
    getParentSelected(state) {
      return state.parent.table.selected
    },
    getSelectedCar(state) {
      return state.parent.selected_car
    },
    getSelectedDriver(state) {
      return state.parent.selected_driver
    },
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
    onReset(name = null, prop = 'parent') {
      if (!name) {
        for (let property in this[prop].form) {
          this[prop].form[property] = null
          this.errors = {}
          if (property === 'car_id') {
            this[prop].selected_car = null
          }
          if (property === 'driver_id') {
            this[prop].selected_driver = null
          }
        }
        this[prop].table.selected = []
      } else {
        this[prop].form[name] = null
        if (this.errors.hasOwnProperty(name)) {
          this.errors[name] = ''
        }
        if (name === 'driver_id') {
          this[prop].selected_driver = null
        }
        if (name === 'car_id') {
          this[prop].selected_car = null
        }
      }
    },
    async getTradeDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
    async getTradeData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.parent.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.parent.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getTradeDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.parent.table.data = returnedData.tradings.data
      this.parent.drivers = returnedData.drivers
      this.parent.drivers_option = returnedData.drivers?.slice(0, 10)

      this.parent.cars = returnedData.cars
      this.parent.cars_option = returnedData.cars?.slice(0, 10)

      // update only rowsNumber = total rows
      this.parent.table.pagination.rowsNumber = returnedData.tradings.meta.total

      // don't forget to update local pagination object
      this.parent.table.pagination.page = page
      this.parent.table.pagination.rowsPerPage = rowsPerPage
      this.parent.table.pagination.sortBy = sortBy
      this.parent.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.parent.table.loading = false
      return true
    },
    async submitTradingForm(path) {
      this.parent.table.loading = true
      const params = this.parent.form;

      const url = this.parent.form.id ? `${path}/${this.parent.form.id}` : path
      await api({
        method: this.parent.form.id ? 'patch' : 'post',
        url: url,
        data: params
      }).then((response) => {
        this.parent.table.selected = []
        this.onReset()
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.id ? 'Data transaksi DO berhasil diubah' : 'Data transaksi DO berhasil disimpan'
        })
        this.parent.table.filter = String(Date.now())
        this.onReset()
        if (response.data.hasOwnProperty('data')) {
          this.router.push({
            name: 'app.transaction.pembelianSawit.viewDetailsTransaction',
            params: {id: response.data.data.id}
          })
        }
      }).catch(e => {
        this.setError(e);
      }).finally(() => this.parent.table.loading = false);
    },
    async submitTradingDelete(path = '/') {
      this.parent.table.loading = true
      await api.delete(path + "/" + this.parent.table.selected[0].id)
        .then(() => {
          Notify.create({
            position: "top",
            type: 'positive',
            message: 'Transaksi berhasil dihapus'
          })
          this.parent.table.filter = String(Date.now())
          this.parent.table.selected = []
          this.onReset()
        }).catch(e => {
          this.parent.table.selected = []
          this.setError(e);
        }).finally(() => this.parent.table.loading = false);
    },
  }
})
