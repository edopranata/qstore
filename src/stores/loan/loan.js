import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useLoanStore = defineStore('loan', {
  state: () => ({
    modal: {
      in: false,
      out: false
    },
    select: {
      type: null,
      print: false,
      customers: [],
      customers_option: [],
      selected_customer: null,
      customer_id: null,
      loan_id: null,
      amount: null,
      installment: null,
      trade_date: null,
    },
    table: {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      loan: null,
      filter: null,
      selected: ref([]),
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal", field: "trade_date", sortable: false, align: 'left'},
        {name: "invoice", label: "Transaksi", field: "invoice", sortable: false, align: 'left'},
        {name: "opening_balance", label: "Saldo awal", field: "opening_balance", sortable: false},
        {name: "debit", label: "Debit (Pinjaman)", field: "balance", sortable: false},
        {name: "credit", label: "Kredit (Angsuran)", field: "balance", sortable: false},
        {name: "ending_balance", label: "Saldo Akhir", field: "balance", sortable: false},
      ]),
      data: [],
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected
    },
    getSelectedType(state) {
      return state.select.type
    },
    getSelectedCustomer(state){
      return state.select.selected_customer
    },
    getModal(state){
      return state.modal
    }
  },

  actions: {
    unsetError(name){
      if(this.errors.hasOwnProperty(name)){
        delete this.errors[name]
      }
    },
    onReset() {
      this.select.selected_customer = null
      this.select.type = null

      this.select.customer_id = null
      this.select.loan_type = null
      this.select.amount = null
      this.select.installment = null
      this.select.trade_date = null
      this.select.print = false

      this.table.data = []

      this.errors = {}
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
    async getLoanDataFromApi(path, startRow, count, filter, sortBy, descending) {
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

      if (!!this.select.type && this.select.selected_customer?.hasOwnProperty('id')) {
        data.details = true
        data.type = this.select.type
        data.customer_id = this.select.selected_customer.id
        try {
          const params = new URLSearchParams(data);
          const response = await api.get(path, {params})
          this.table.data = response.data.details.data
          this.table.loan = response.data.loan

          // update only rowsNumber = total rows
          this.table.pagination.rowsNumber = response.data.details.total
        } catch (e) {
          // this.setError(e)
        }
      } else {
        this.table.data = []
        // update only rowsNumber = total rows
        this.table.pagination.rowsNumber = 0
      }

      this.table.loading = false
    },
    async getLoanData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getLoanDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      if (returnedData) {
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
      }
      return true
    },
    async loadAllCustomers(path) {
      try {
        const response = await api.get(path)
        this.select.customers = response.data.customers
      } catch (e) {
        this.setError(e)
      }
    },

    async submitLoan(path) {
      this.table.loading = true
      const loan_id = this.select.loan_id
      let act = null
      const data = {
        customer_id: this.select.customer_id,
        customer_type: this.select.type,
        trade_date: this.select.trade_date,
      }
      if(this.select.installment > 0){
        data.installment = this.select.installment * -1
        act = `${path}/${loan_id}/installment`
      }
      if(this.select.amount > 0){
        data.amount = this.select.amount
        act = `${path}/${loan_id}/add`
      }

      if(loan_id) {
        try {
          const response = await api.post(act, data)
          const invoice_number = response.data.data?.invoice_number
          if(this.select.print && invoice_number){
            this.table.loading = false
            this.router.replace({name: 'app.invoice.invoiceData.printInvoice', params: { invoice_number : invoice_number }})
          }else{
            await this.loadAllCustomers(path)
            this.onReset()

            for (let property in this.modal) {
              this.modal[property] = false
            }
            this.table.loading = false
          }

        } catch (e) {
          this.table.loading = false
          this.setError(e)
        }
      }

    },


  }
})
