import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useInvoiceTradingStore = defineStore('invoiceTrading', {
  state: () => ({
    dialog: {
      open: false,
      print: false,
    },
    form: {
      customer_id: '',
      trade_date: '',
      installment: 0,
      trade_details_id: []
    },
    table: {
      selected: ref([]),
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "name", label: "Customer", field: "name", sortable: false, align: 'left'},
        {name: "trade_weight", label: "Tonase (kg)", field: "trade_weight", sortable: false, align: 'right'},
        {name: "trade_price", label: "Harga Rata-rata (Rp)", field: "trade_price", sortable: false, align: 'right'},
        {name: "trade_total", label: "Total (Rp)", field: "trade_total", sortable: false, align: 'right'},
        {name: "created_by", label: "Created by", field: "created_by", sortable: false, align: 'left'},
        {name: "created_at", label: "Created by", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
    },
    details:{
      customer: {},
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "trade_date", label: "Tanggal Transaksi", field: "trade_date", sortable: true, align: 'left'},
        {name: "car", label: "Mobil/Supir",  sortable: true, align: 'left'},
        {name: "weight", label: "Berat (kg)", field: "weight", sortable: true},
        {name: "price", label: "Harga (Rp)", field: "price", sortable: true},
        {name: "total", label: "Total (Rp)", field: "total", sortable: true},
      ]),
      data: []
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected.length > 0 ? state.table.selected[0] : {}
    },

    getSummaries(state){
      const data = {}
      data.loan = state.details.customer?.loan ?? 0
      data.total = parseFloat(state.details.data ? state.details.data.length > 0 ? state.details.data.reduce((total, next) => total + parseFloat(next.total), 0) : 0 : 0)
      data.weight = parseFloat(state.details.data ? state.details.data.length > 0 ? state.details.data.reduce((total, next) => total + parseFloat(next.weight), 0) : 0 : 0)
      data.price = parseFloat(state.details.data ? state.details.data.length > 0 ? state.details.data.reduce((total, next) => total + parseFloat(next.price), 0) / parseFloat(state.details.data.length) : 0 : 0)
      data.loan_status = data.loan !== 0
      data.loan_total = data.loan - state.form.installment ?? 0
      data.net_total = data.total - state.form.installment ?? 0
      return data
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
    async getCustomerTrade(path) {
      this.table.loading = true
      try {
        const response = await api.get(path)
        this.table.data = response.data.data
      } catch (e) {
        this.setError(e)
      }

      this.table.loading = false
    },

    async getSingleCustomerTrade(path) {
      this.table.loading = true
      try {
        const response = await api.get(path)
        this.details.customer = response.data.customer
        this.details.data = response.data.details
        this.form.trade_details_id = response.data.details.map(item => item.id)
        this.form.customer_id = response.data.customer.id
      } catch (e) {
        this.setError(e)
      }

      this.table.loading = false
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
          this.router.replace({name: 'app.invoice.invoiceData.printInvoice', params: { invoice_number : invoice_number }})
        }else {
          this.router.replace({name: 'app.jualBeliSawit.buatInvoicePetani.index'})
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
