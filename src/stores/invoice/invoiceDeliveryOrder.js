import {defineStore} from 'pinia'
import {reactive} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const useInvoiceDeliveryOrderStore = defineStore('invoiceDO', {
  state: () => ({
    dialog: {
      open: false,
      print: false,
    },
    form: {
      type: 'Customer',
      installment: 0,
      total: 0,
      net_total: 0,
      trade_id: null,
      customer_id: null,
      trade_date: null,
    },
    loan: {
      balance: 0,
      ending_balance: 0,
    },

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
      return state.form.type
    },
    getSummaries(state) {
      let data = {}
      data.average = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + next.net_price, 0) / state.table.data.length : 0;
      data.weight = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + next.net_weight, 0) : 0
      data.total = state.table.data.length > 0 ? state.table.data.reduce((total, next) => total + (next.gross_total - next.net_total), 0) : 0
      data.loan = state.select.selected_customer ? state.select.selected_customer.loan ? state.select.selected_customer.loan : 0 : 0
      return data
    },

    getAllCustomers(state) {
      return state.select.customers
    },
    getForm(state) {
      return state.form
    },
    getLoan(state) {
      return state.loan
    }
  },

  actions: {
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
        } else if( e.response.status === 403) {
          this.errors = {};
          Notify.create({
            position: "top",
            type: 'negative',
            message: e.response.message ?? e.response.statusText
          })
          this.router.replace({name: 'app.unauthorized'})
        }else{
          this.errors = {};
          Notify.create({
            position: "top",
            type: 'negative',
            message: e.response.message ?? e.response.statusText
          })
        }
      }else{
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
    onReset() {
      for (let property in this.form){
        this.form[property] = null
      }
      this.select.selected_customer = null
      this.errors = {}
      this.table.selected = []
      this.dialog.open = false
      this.form.type = 'Customer'
    },
    async getCustomersOrder(path) {
      const type = this.form.type ?? 'Customer'
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
      const searchType = this.form.type

      switch (searchType) {
        case 'Customer' :
          this.table.loading = true
          setTimeout(() => {
            this.table.data = []
            if (this.select.selected_customer && this.table.orders.length > 0) {
              let data = this.table.orders.filter(item => item.customer_type.endsWith(searchType) && item.customer_id === this.select.selected_customer.id)
              this.table.data = data
              this.form.trade_id = data.map(item => item.id)
              this.table.loading = false
            } else {
              this.table.data = []
              this.form.trade_id = null
              this.table.loading = false
            }
            this.calculation()
          }, 550)
          break
        case 'Plantation':
          this.table.loading = true
          setTimeout(() => {
            let data = this.table.orders.length > 0 ? this.table.orders.filter(item => item.customer_type.endsWith(searchType)) : []
            this.table.data = data
            this.form.trade_id = data.length > 0 ? data.map(item => item.id) : null
            this.select.selected_customer = null
            this.calculation()
            this.table.loading = false
          }, 500)

          break
        case 'Trading':
          this.table.loading = true
          setTimeout(() => {
            let data = this.table.orders.length > 0 ? this.table.orders.filter(item => item.customer_type.endsWith(searchType)) : []
            this.table.data = data
            this.form.trade_id = data.length > 0 ? data.map(item => item.id) : null
            this.select.selected_customer = null
            this.calculation()
            this.table.loading = false
          }, 500)
          break
      }
    },
    calculation() {
      let loan_balance = this.select.selected_customer ? this.select.selected_customer.loan ? this.select.selected_customer.loan : 0 : 0
      let total = this.table.data.length > 0 ? this.table.data.reduce((total, next) => total + (next.gross_total - next.net_total), 0) : 0

      this.form.customer_id = this.select.selected_customer ? this.select.selected_customer.id : null

      this.loan.balance = loan_balance
      this.loan.ending_balance = loan_balance

      this.form.total = total
      this.form.net_total = total
      this.form.installment = 0
    },
    async submitForm(path) {
      this.table.loading = true
      const params = this.form;

      const url = this.form.id ? `${path}/${this.form.id}` : path
      await api({
        method: this.form.id ? 'patch' : 'post',
        url: url,
        data: params
      }).then((response) => {
        this.table.selected = []
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.id ? 'Data transaksi berhasil diubah' : 'Data transaksi berhasil disimpan'
        })
        const invoice_number = response.data.data?.invoice_number
        if(this.dialog.print && invoice_number){
          this.router.replace({name: 'app.deliveryOrder.invoiceData.printInvoice', params: { invoice_number : invoice_number }})
        }else {
          this.table.data = []
          this.onReset()
          this.getCustomersOrder(path)

        }

      }).catch(e => {
        this.setError(e);
      }).finally(() => {
        this.table.loading = false
        this.dialog.open = false
      });
    }
  }
})
