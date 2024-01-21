import {defineStore} from 'pinia'
import {reactive, ref} from "vue";
import {LocalStorage, Notify} from "quasar";
import {api} from "boot/axios";

export const useAreasStore = defineStore('areas', {
  state: () => ({
    dialog: {
      create: false,
      edit: false,
      delete: false,
    },
    form: {
      id: '',
      name: '',
    },
    deleted: {
      area_id: [],
      data: [],
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
        {name: "name", label: "Area Name", field: "name", sortable: true, align: 'left'},
        {name: "user", label: "Created By", field: 'created_by', sortable: false, align: 'left'},
        {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
    },
    errors: {},
  }),

  getters: {
    getSelected(state) {
      return state.table.selected
    }
  },

  actions: {
    openDialog(dialog) {
      if (this.dialog.hasOwnProperty(dialog)) {
        if (dialog === 'create') {
          for (const property in this.form) {
            this.form[property] = ''
          }
          this.table.selected = [];
        }
        this.dialog[dialog] = !this.dialog[dialog]
      }
    },
    closeDialog(dialog) {
      if (this.dialog.hasOwnProperty(dialog)) {
        this.dialog[dialog] = !this.dialog[dialog]
      }
    },
    closeAllDialog() {
      for (const property in this.dialog) {
        this.dialog[property] = false
      }
    },
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
    async getAreasDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
      data.name = this.table.search.name ?? ''
      data.user = this.table.search.user ?? ''
      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },
    async getAreasData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getAreasDataFromApi(path, page, fetchCount, filter, sortBy, descending)

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
      return true
    },

    async submitForm(path) {
      this.table.loading = true
      const params = this.form;
      if (this.dialog.create) {
        delete params.id
      }
      const url = params.id ? `${path}/${params.id}` : path
      await api({
        method: this.form.id ? 'patch' : 'post',
        url: url,
        data: params
      }).then(() => {
        this.table.selected = []
        this.closeAllDialog()
        Notify.create({
          position: "top",
          type: 'positive',
          message: params.hasOwnProperty('id') ? 'Data area berhasil di update' : 'Data area berhasil disimpan'
        })
        this.table.filter = String(Date.now())
        this.onReset()
      }).catch(e => {
        this.setError(e);
      }).finally(() => this.table.loading = false);
    },

    async submitDelete(path = '/') {
      this.table.loading = true
      const params = this.deleted
      await api.delete(path + "/" + this.deleted.area_id[0], {params})
        .then(() => {
          Notify.create({
            position: "top",
            type: 'positive',
            message: this.deleted.area_id.length > 1 ? `${this.deleted.area_id.length} areas delete` : `${this.deleted.area_id.length} area delete`
          })

          this.table.filter = String(Date.now())
          this.table.selected = []
          this.closeDialog('delete')
          this.onReset()
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
  }
})
