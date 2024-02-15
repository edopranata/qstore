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
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected.length > 0 ? state.table.selected[0] : {}
    },

    getSummaries(state){
      return state.table.selected.length > 0 ? state.table.selected[0].hasOwnProperty('trade_total') ? state.table.selected[0].trade_total - state.form.installment: 0 : 0
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
          this.getCustomerTrade(path)
          this.onReset()
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
