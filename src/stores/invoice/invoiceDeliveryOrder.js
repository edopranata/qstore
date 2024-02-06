import {defineStore} from 'pinia'
import {reactive} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const useInvoiceDeliveryOrderStore = defineStore('invoiceDO', {
  state: () => ({
    select: {
      customers: [],
      customers_option: [],
      selected_customer: null,
    },
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
      search: {
        type: null,
      },
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "customer.name", label: "Customer", field: "customer_name", sortable: false, align: 'left'},
        {name: "delivery_date", label: "Delivery Date", field: "delivery_date", sortable: true, align: 'left'},
        {name: "net_weight", label: "Weight", field: "net_weight", sortable: true},
        {name: "net_price", label: "Price", field: "net_price", sortable: true},
        {name: "margin", label: "Margin", field: "margin", sortable: true},
        {name: "gross_total", label: "Gross Total", field: "gross_total", sortable: true},
        {name: "net_customer", label: "Net Customer", sortable: false},
        {name: "net_total", label: "Net Income", field: "net_total", sortable: true},
        {name: "invoice_status", label: "Invoice", field: "invoice_status", sortable: false, align: 'left'},
        {name: "income_status", label: "Income", field: "income_status", sortable: false, align: 'left'},
      ]),
      data: [],
      orders: []
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected
    },
    getCustomerOption(state) {
      return state.table.search
    },
    getSummaries(state) {
      let data = {}
      data.average = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + next.net_price, 0) / state.table.data.length : 0;
      data.weight = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + next.net_weight, 0) : 0
      data.total = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + (next.gross_total - next.net_total), 0) : 0
      return data
    },
    getAllCustomers(state) {
      return state.select.customers
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
      this.table.search.type = null
      this.select.selected_customer = null
      this.errors = {}
      this.table.selected = []

    },
    async getCustomersOrder(path) {
      const type = this.table.search.type ?? 'Customer'
      const data = {
        type: type,
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        this.table.orders = response.data.hasOwnProperty('orders') ? response.data.orders : []

        this.select.customers = response.data?.customers
        this.select.customers_option = response.data?.customers


      } catch (e) {
        this.setError(e)
      }
    },
    async getDeliveryOrderData() {
      this.table.loading = true
      const searchType = this.table.search.type

      switch (searchType) {
        case 'Customer' :
          setTimeout(() => {
            this.table.data = []
            if (this.select.selected_customer.hasOwnProperty('id') && this.table.orders.length > 0) {
              this.table.data = this.table.orders.filter(item => item.customer_type.endsWith(searchType) && item.customer_id === this.select.selected_customer.id)
            } else {
              this.table.data = []
            }
            this.table.loading = false
          }, 700)
          break
        case 'Plantation':
          setTimeout(() => {
            this.table.data = this.table.orders.length > 0 ? this.table.orders.filter(item => item.customer_type.endsWith(searchType)) : []
            this.select.selected_customer = null
            this.table.loading = false
          }, 500)

          break
        case 'Trading':
          setTimeout(() => {
            this.table.data = this.table.orders.length > 0 ? this.table.orders.filter(item => item.customer_type.endsWith(searchType)) : []
            this.select.selected_customer = null
            this.table.loading = false
          }, 500)
          break
      }
    }

  }
})
