import {defineStore} from 'pinia'
import {reactive} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const useRolesStore = defineStore('roles', {
  state: () => ({
    dialog: {
      create: false,
      edit: false,
      delete: false,
      update: false,
    },
    form: {
      create: {
        name: '',
      },
      edit: {
        id: '',
        name: '',
      },
      delete: {
        roles_id: []
      },
      delete_data: [],
    },
    table: {
      search: {
        name: ''
      },
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      from: 0,
      selected: [],
      filter: '',
      loading: false,
      headers: reactive([
        {name: "id", label: "No", field: "id", sortable: true, align: 'left'},
        {name: "action", label: "Action", sortable: false, align: 'left', headerClass: 'tw-w-80'},
        {name: "name", label: "Name", field: "name", sortable: true, align: 'left'},
        {name: "permissions_count", label: "Permission Count", field: "permissions_count", sortable: false, align: 'left'},
        {name: "users_count", label: "User Count", field: "users_count", sortable: false, align: 'left'},
        {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
      roles: [],
    },
    view:{
      all: {},
      active: [],
      selected: null,
    },
    errors: {},
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2
    }
  },

  actions: {
    openDialog(dialog){
      if(this.dialog.hasOwnProperty(dialog)){
        this.dialog[dialog] = !this.dialog[dialog]
      }
    },
    closeAllDialog(){
      for (const property in this.dialog) {
        this.dialog[property] = false
      }
    },
    closeDialog(dialog){
      if(this.dialog.hasOwnProperty(dialog)){
        this.dialog[dialog] = !this.dialog[dialog]
      }
    },

    onReset(form){
      if(this.form.hasOwnProperty(form)){
        if(form === 'delete'){
          this.form.delete.roles_id = []
          this.form.delete_data = []
        }else{
          for (const property in this.form[form]) {
            this.form[form][property] = ''
          }
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
    async loadPermissionList(path) {
      this.table.loading = true
      await api.get(path)
        .then(response => {
          this.view.selected = response.data?.data.role;
          this.view.all = response.data?.data.all;
          this.view.active = response.data?.data.active;

        })
        .catch(e => {
          this.view.selected = {}
          this.view.all = {}
          this.view.active = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
    async getRolesDataFromApi(path, startRow, count, filter, sortBy, descending) {
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

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },

    async getRolesData (path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getRolesDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.data
      // this.table.roles = returnedData.roles

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

    async submitCreate(path) {
      this.table.loading = true
      let params = this.form.create;
      await api.post(path, params)
        .then(() => {
          this.table.selected = []
          this.closeDialog('create')
          Notify.create({
            position: "top",
            type: 'positive',
            message: `Role created`
          })
          this.table.filter = String(Date.now())
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
    async submitEdit(path) {
      this.table.loading = true
      let params = this.form.edit;
      await api.patch(path + "/" + this.form.edit.id, params)
        .then(() => {
          this.table.selected = []
          this.closeDialog('edit')
          Notify.create({
            position: "top",
            type: 'positive',
            message: `Role update success`
          })
          this.table.filter = String(Date.now())
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
    async submitDelete(path = '/'){
      this.table.loading = true
      const params = this.form.delete
      await api.delete(path + "/" + this.form.delete.roles_id[0], {params})
        .then(() => {
          this.table.selected = []
          this.closeDialog('delete')
          Notify.create({
            position: "top",
            type: 'positive',
            message: this.form.delete.roles_id.length > 1 ? `${this.form.delete.roles_id.length} roles delete` : `${this.form.delete.roles_id.length} role delete`
          })
          this.table.filter = String(Date.now())
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },
    async addPermissionsToRole(path) {
      let params = {
        permissions: this.view.active
      }
      this.errors = {}
      this.table.loading = true
      await api.patch(path, params)
        .then(response => {
          this.view.selected = response.data?.data.role;
          this.view.all = response.data?.data.all;
          this.view.active = response.data?.data.active;
          Notify.create({
            position: "top",
            type: 'positive',
            message: `Permission added to role ${this.view.selected.name}`
          })
          this.closeAllDialog()
        })
        .catch(e => {
          if(e.response.status !== 422){
            this.view.selected = {}
            this.view.all = {}
            this.view.active = []
          }
          this.setError(e);
        }).finally( () => this.table.loading = false )
    },
  }
})
