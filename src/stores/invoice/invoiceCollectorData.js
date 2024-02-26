import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useInvoiceCollectorDataStore = defineStore('invoiceCollector', {
  state: () => ({
    table: {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      filter: null,
      selected: ref([]),
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "customer_name", label: "Pengepul", field: "customer_name", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal Invoice", field: "trade_date", sortable: true, align: 'left'},
        {name: "invoice_number", label: "No Nota", field: "invoice_number", sortable: true, align: 'left'},
        {name: "detail_do", label: "Diterima Pengepul", field: "detail_do", sortable: false, align: 'right'},
        {name: "loan_detail", label: "Pinjaman", field: "loan_detail", sortable: false, align: 'right'},
        {name: "created_by", label: "Created by", field: "created_by", sortable: false, align: 'left'},
        {name: "created_at", label: "Created by", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected
    },
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
    async getInvoiceDataFromApi(path, startRow, count, filter, sortBy, descending) {
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


      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        this.table.data = response.data.data

        // update only rowsNumber = total rows
        this.table.pagination.rowsNumber = response.data.details.total
      } catch (e) {
        // this.setError(e)
      }

      this.table.loading = false
    },
    async getInvoiceData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getInvoiceDataFromApi(path, page, fetchCount, filter, sortBy, descending)

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
