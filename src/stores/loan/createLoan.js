import {defineStore} from 'pinia'
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useLoanCreateStore = defineStore('loanCreate', {
  state: () => ({
    dialog: {
      open: false,
      print: false,
    },
    select: {
      customers: [],
      customers_option: [],
      selected_customer: null,
    },
    form: {
      type: null,
      trade_date: null,
      customer_id: '',
      balance: '',
    },
    table: {
      loading: false
    },
    errors: {},
  }),

  getters: {
    getSelectedType(state) {
      return state.form.type
    },
    getSelectedCustomer(state){
      return state.select.selected_customer
    }
  },

  actions: {
    onReset() {
      for (let property in this.form){
        this.form[property] = null
      }
      this.errors = {}
      this.dialog.open = false
      this.table.loading = false
    },
    unsetError(name){
      if(this.errors.hasOwnProperty(name)){
        delete this.errors[name]
      }
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
      this.table.loading = false
      this.dialog.open = false
    },
    async loadAllCustomers(path) {
      try {
        const response = await api.get(path)
        this.select.customers = response.data.customers
      } catch (e) {
        this.setError(e)
      }
    },

    async submitForm(path) {
      this.table.loading = true
      const params = this.form
      try {
        const response = await api.post(path, params)
        const invoice_number = response.data.data?.invoice_number
        if(this.dialog.print && invoice_number){
          this.router.replace({name: 'app.invoice.invoiceData.printInvoice', params: { invoice_number : invoice_number }})
        }else{
          this.table.loading = false
          this.onReset()
          this.router.replace({name: 'app.pinjaman.dataPinjaman.index'})
        }
      } catch (e) {
        this.setError(e)
      }
    },
  }
})
