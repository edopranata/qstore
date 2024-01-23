import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const useDeliveryOrderStore = defineStore('deliveryOrder', {
  state: () => ({
    customers: [],
    customers_option: [],
    selected_customer: null,
    form: {
      delivery_date: '',
      customer_id: '',
      net_weight: '',
      net_price: '',
      margin: '',
      net_total: '',
      gross_total: '',
    },
    table: {
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      from: 0,
      selected: ref([]),
      filter: '',
      search: {
        name: '',
        user: '',
      },
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "customer.name", label: "Customer", field: "customer_name", sortable: false, align: 'left'},
        {name: "delivery_date", label: "Delivery Date", field: "delivery_date", sortable: true, align: 'left'},
        {name: "net_weight", label: "Weight", field: "net_weight", sortable: true, align: 'left'},
        {name: "net_price", label: "Price", field: "net_price", sortable: true, align: 'left'},
        {name: "margin", label: "Margin", field: "margin", sortable: true, align: 'left'},
        {name: "gross_total", label: "Gross Total", field: "gross_total", sortable: true, align: 'left'},
        {name: "net_total", label: "Net Total", field: "net_total", sortable: true, align: 'left'},
        {name: "invoice_status", label: "Invoice", field: "invoice_status", sortable: false, align: 'left'},
        {name: "income_status", label: "Income", field: "income_status", sortable: false, align: 'left'},
      ]),
      data: [],
    },
    errors: {},
  }),

  getters: {},

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
    async getDeliveriesDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
    async getDeliveriesData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getDeliveriesDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.deliveries.data
      this.customers = returnedData.customers
      this.customers_option = returnedData.customers?.slice(0, 10)
      // update only rowsNumber = total rows
      this.table.pagination.rowsNumber = returnedData.deliveries.meta.total

      // don't forget to update local pagination object
      this.table.pagination.page = page
      this.table.pagination.rowsPerPage = rowsPerPage
      this.table.pagination.sortBy = sortBy
      this.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.table.loading = false
      return true
    },
  }
})
