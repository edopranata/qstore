import {defineStore} from 'pinia'
import {useAuthStore} from "stores/authStore";
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";
import {usePageStore} from "stores/helper/pageStore";

const {setting} = usePageStore()
const {can} = useAuthStore()
export const useTradingsStore = defineStore('tradings', {
  state: () => ({
    parent: {
      form: {
        id: '',
        trade_date: '',
        trade_cost: '',
        car_id: '',
        driver_id: '',
        car_fee: '',
        driver_fee: '',
        loader_fee: '',
        car_transport: '',
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
    details: {
      form: {
        id: '',
        customer_id: '',
        trade_date: '',
        weight: '',
        price: '',
        total: '',
        net_weight: '',
        net_price: '',
        net_total: '',
        car_fee: '',
        driver_fee: '',
        car_price: '',
        loader_fee: '',
        loader_price: '',
        car_transport: '',
        driver_price: '',
        net_income: '',
        trade_status: '',
      },
      trading: {},
      customers: [],
      customers_option: [],
      selected_customer: null,
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
          {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
          {name: "trade_date", label: "Tanggal Transaksi", field: "trade_date", sortable: true, align: 'left'},
          {name: "customer_name", label: "Petani", field: "customer_name", sortable: false, align: 'left'},
          {name: "weight", label: "Berat (kg)", field: "weight", sortable: true},
          {name: "price", label: "Harga (Rp)", field: "price", sortable: true},
          {name: "total", label: "Total (Rp)", field: "total", sortable: true},
          {name: "farmer_status", label: "Invoice Status", field: "farmer_status", sortable: true, align: 'left'},
          {name: "created_by", label: "User", field: "created_by", sortable: false, align: 'left'},
          {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
        ]),
        data: [],
      },
    },
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

    getDetailsFormField(state) {
      return state.details.form
    },
    getDetailsSelected(state) {
      return state.details.table.selected
    },
    getSelectedCustomer(state) {
      return state.details.selected_customer
    },
    getTrading(state) {
      return state.details.trading
    },
    editStatus(state) {
      return state.details.form.trade_status
    }
  },

  actions: {
    setError(e) {
      if (e.hasOwnProperty('response')) {
        if (e.response.status === 422) {
          let error = e.response.data.errors;
          for (let property in error) {
            this.errors[property] = error[property][0];
          }
        } else if (e.response.status === 401) {
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
      } else {
        Notify.create({
          position: "top",
          type: 'negative',
          message: 'Unknown error'
        })
      }
    },
    unsetError(error) {
      if (this.errors.hasOwnProperty(error)) {
        delete this.errors[error]
      }
    },
    onReset(prop = 'parent') {
      for (let property in this[prop].form) {
        this[prop].form[property] = null
        this.errors = {}
        if (property === 'car_id') {
          this[prop].selected_car = null
        }
        if (property === 'driver_id') {
          this[prop].selected_driver = null
        }
        if (property === 'customer_id') {
          this[prop].selected_customer = null
        }
      }
      this[prop].table.selected = []
      this.loadSetting(prop)
    },
    loadSetting(prop = 'parent') {
      for (let property in setting) {
        if (this[prop].form.hasOwnProperty(property)) {
          this[prop].form[property] = setting[property]
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
    async submitFactoryForm(path) {
      this.details.table.loading = true
      const params = this.details.form;

      await api({
        method: 'patch',
        url: path,
        data: params
      }).then(() => {
        this.details.table.selected = []
        Notify.create({
          position: "top",
          type: 'positive',
          message: 'Data transaksi berhasil disimpan'
        })
        this.details.table.filter = String(Date.now())
        this.onReset('details')
        this.router.push({
          name: 'app.jualBeliSawit.pembelianSawit.index'
        })
      }).catch(e => {
        this.setError(e);
      }).finally(() => this.details.table.loading = false);
    },

    async submitTradingForm(path, prop = 'parent') {
      this[prop].table.loading = true
      const params = this[prop].form;

      const url = this[prop].form.id ? `${path}/${this[prop].form.id}` : path
      await api({
        method: this[prop].form.id ? 'patch' : 'post',
        url: url,
        data: params
      }).then((response) => {
        this[prop].table.selected = []
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.id ? 'Data transaksi berhasil diubah' : 'Data transaksi berhasil disimpan'
        })
        this[prop].table.filter = String(Date.now())
        this.onReset(prop)
        if (response.data.hasOwnProperty('data') && prop === 'parent' && can('app.jualBeliSawit.pembelianSawit.viewDetailsTransaction')) {
          this.router.push({
            name: 'app.jualBeliSawit.pembelianSawit.viewDetailsTransaction',
            params: {id: response.data.data.id}
          })
        } else {
          this.getTradeInfo(path)
        }
      }).catch(e => {
        this.setError(e);
      }).finally(() => this[prop].table.loading = false);
    },
    async submitTradingDelete(path, prop = 'parent') {
      this[prop].table.loading = true
      await api.delete(path + "/" + this[prop].table.selected[0].id)
        .then(() => {
          Notify.create({
            position: "top",
            type: 'positive',
            message: 'Transaksi berhasil dihapus'
          })
          this[prop].table.filter = String(Date.now())
          this[prop].table.selected = []
          this.onReset(prop)
        }).catch(e => {
          this[prop].table.selected = []
          this.setError(e);
        }).finally(() => this[prop].table.loading = false);
    },

    async getTradeInfo(path) {
      try {
        const response = await api.get(path)
        this.details.trading = response.data.trading
        this.details.form.net_weight = response.data.trading ? response.data.trading.net_weight : 0
        this.details.form.net_price = response.data.trading ? response.data.trading.net_price : 0
        this.details.form.car_fee = response.data.trading ? response.data.trading.car_fee : 0
        this.details.form.driver_fee = response.data.trading ? response.data.trading.driver_fee : 0
        this.details.form.loader_fee = response.data.trading ? response.data.trading.loader_fee : 0
        this.details.form.trade_status = response.data.trading ? response.data.trading.trade_status !== null : false
      } catch (e) {
        this.setError(e)
      }
    },

    async getDetailsTradeDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
    async getDetailsTradeData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.details.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.details.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getDetailsTradeDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.details.table.data = returnedData.details.data
      this.details.customers = returnedData.customers
      this.details.customers_option = returnedData.customers?.slice(0, 10)


      // update only rowsNumber = total rows
      this.details.table.pagination.rowsNumber = returnedData.details.meta.total

      // don't forget to update local pagination object
      this.details.table.pagination.page = page
      this.details.table.pagination.rowsPerPage = rowsPerPage
      this.details.table.pagination.sortBy = sortBy
      this.details.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.details.table.loading = false

      return true
    },
  }
})
