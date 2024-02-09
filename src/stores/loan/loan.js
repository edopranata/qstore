import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useLoanStore = defineStore('loan', {
  state: () => ({
    select: {
      type: null,
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
      loan: null,
      filter: null,
      selected: ref([]),
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal", field: "trade_date", sortable: false, align: 'left'},
        {name: "transaction", label: "Transaksi", field: "transaction", sortable: false, align: 'left'},
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
    }
  },

  actions: {

    onReset(form = null) {
      if (this.form.hasOwnProperty(form)) {
        if (form === 'delete') {
          this.deleted.area_id = []
          this.deleted.data = []
        }
      }
      this.errors = {}
    },
    setError(e) {
      if (e.response.status === 422) {
        let error = e.response.data.errors;
        for (let property in error) {
          this.errors[property] = error[property][0];
        }
      } else {
        this.errors = {};
        this.closeAllDialog()
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
  }
})
