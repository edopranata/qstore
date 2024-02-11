import {defineStore} from 'pinia'
import {api} from "boot/axios";
import {reactive} from "vue";
import {LocalStorage, Notify} from "quasar";

export const useUsersStore = defineStore('users', {
  state: () => ({
    dialog: {
      create: false,
      edit: false,
      delete: false,
      password: false,
    },
    form: {
      create: {
        name: '',
        username: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: ''
      },
      password: {
        id: '',
        name: '',
        username: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: ''
      },
      edit: {
        id: '',
        username: '',
        email: '',
        role: '',
      },
      delete: {
        user_id: []
      },
      delete_data: [],
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
      selected: [],
      filter: '',
      search: {
        name: '',
        username: '',
        email: '',
        role: '',
      },
      loading: false,
      headers: reactive([
        {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "name", label: "Name", field: "name", sortable: true, align: 'left'},
        {name: "username", label: "Username", field: "username", sortable: true, align: 'left'},
        {name: "email", label: "Email", field: "email", sortable: true, align: 'left'},
        {name: "role", label: "Role User", field: row => row.roles.length > 0 ? row.roles[0] : '', sortable: false, align: 'left'},
        {name: "created_at", label: "Created At", field: "created_at", sortable: true, align: 'left'},
      ]),
      data: [],
      roles: [],
    },
    errors: {},
  }),

  getters: {
    getSelected() {
      let selected = this.table.selected
      let more = selected.length > 1 ? ` and ${selected.length - 1} more` : ''
      return selected.length > 0 ? selected[0].name + more : 'No selected data'
    },
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
          this.form.delete.user_id = []
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
    async getUsersDataFromApi(path, startRow, count, filter, sortBy, descending) {
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
      data.username = this.table.search.username ?? ''
      data.email = this.table.search.email ?? ''
      data.role = this.table.search.role ?? ''
      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },

    async getUsersData (path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getUsersDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.data
      this.table.roles = returnedData.roles

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
            message: `user update success`
          })
          this.table.filter = String(Date.now())
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    },

    async submitChange(path){
      let params = this.form.password;
      await api.post(path + "/" + this.form.password.id, params)
        .then(() => {
          this.table.selected = []
          this.closeDialog('password')
          Notify.create({
            position: "top",
            type: 'positive',
            message: `Change password success`
          })
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
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
            message: `User created`
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
      await api.delete(path + "/" + this.form.delete.user_id[0], {params})
        .then(() => {
          this.table.selected = []
          this.closeDialog('delete')
          Notify.create({
            position: "top",
            type: 'positive',
            message: this.form.delete.user_id.length > 1 ? `${this.form.delete.user_id.length} users delete` : `${this.form.delete.user_id.length} user delete`
          })
          this.table.filter = String(Date.now())
        }).catch(e => {
          this.table.selected = []
          this.setError(e);
        }).finally(() => this.table.loading = false);
    }
  }
})
