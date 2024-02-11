import {defineStore} from 'pinia'
import {reactive} from "vue";
import {api} from "boot/axios";
import {LocalStorage, Notify} from "quasar";

export const usePermissionsStore = defineStore('permissions', {
  state: () => ({
    trees: {
      data: [],
    },
    table: {
      users: {
        pagination: {
          sortBy: '',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        search: {
          name: '',
          username: '',
          email: '',
          role: '',
        },
        headers: reactive([
          {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
          {name: "name", label: "Name", field: 'name', sortable: true, align: 'left'},
          {name: "username", label: "Username", field: 'username', sortable: true, align: 'left'},
          {name: "email", label: "E-Mail", field: "email", sortable: true, align: 'left'},
          {name: "role", label: "Role", field: row => row.roles.length > 0 ? row.roles[0] : '', sortable: true, align: 'left'},
        ]),
        roles: [],
        data: [],
        filter: '',
        loading: false,
      },
      roles: {
        pagination: {
          sortBy: '',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        headers: reactive([
          {name: "no", label: "No", field: "id", sortable: false, align: 'left'},
          {name: "name", label: "Name", field: "name", sortable: true, align: 'left'},
        ]),
        data: [],
        filter: '',
        loading: false,
      },
      dialog: false,
      tree_items: [],
      pagination: {
        sortBy: '',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      },
      headers: reactive([
        {name: "id", label: "No", field: "id", sortable: false, align: 'left'},
        {name: "action", label: "Action", sortable: false, align: 'left'},
        {name: "title", label: "Title", field: 'title', sortable: true, align: 'left'},
        {name: "parent", label: "Parent", field: "parent", sortable: true, align: 'left'},
        {name: "children", label: "Children", field: "children", sortable: true, align: 'left'},
        {name: "name", label: "Name", field: "name", sortable: true, align: 'left'},
      ]),
      data: [],
      selected: {
        loading: false,
        data: [],
        headers: reactive([
          {name: "grouped", label: "Group Menu", field: 'parent', sortable: false, align: 'left'},
          {name: "name", label: "Route Name", field: 'name', sortable: false, align: 'left'},
          {name: "path", label: "Route Path", field: "path", sortable: false, align: 'left'},
          {name: "method", label: "Method", field: "method", sortable: false, align: 'left'},
          {name: "title", label: "Path", field: "title", sortable: false, align: 'left'},
        ]),
      },
      filter: '',
      loading: false,
    }
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2
    }
  },

  actions: {
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
    async syncNewPermissions(path){
      this.table.loading = true
      await api.post(path)
        .then(response => {
          Notify.create({
            position: "top",
            type: 'positive',
            message: "Synchronize permissions success"
          })
          this.trees.data = response.data
          this.table.dialog = false
          return response

        }).catch(e => {
          this.setError(e)
        }).finally(() => {
          this.table.loading = false
          this.table.data = []
        })
    },

    async getPermissionTreeFromApi(path) {
      try {
        return await api.get(path)
      } catch (e) {
        this.setError(e)
      }
    },
    async getPermissionTree(path) {
      this.table.loading = true
      const response = await this.getPermissionTreeFromApi(path)
      this.trees.data = response.data
      this.table.loading = false
    },

    async getPermissionsDataFromApi(path, startRow, count, filter, sortBy, descending) {
      const data = {
        page: startRow,
        limit: count,
        children: filter
      }

      // Sort by field descending or ascending
      if (sortBy) {
        const orderBy = descending ? 'desc' : 'asc'
        data.sortBy = JSON.stringify({
          key: sortBy,
          order: orderBy
        })
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.get(path, {params})
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },

    async getPermissionsData(path, props) {
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table.pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getPermissionsDataFromApi(path, page, fetchCount, filter, sortBy, descending)

      // clear out existing data and add new
      this.table.data = returnedData.data ?? []


      // update only rowsNumber = total rows
      this.table.pagination.rowsNumber = returnedData.total

      // don't forget to update local pagination object
      this.table.pagination.page = page
      this.table.pagination.rowsPerPage = rowsPerPage
      this.table.pagination.sortBy = sortBy
      this.table.pagination.descending = descending

      // ...and turn of loading indicator
      this.table.loading = false
      return true
    },
    async viewPermission(path) {
      await api.get(path)
        .then(response => {
          this.table.selected.data = response.data.data;
        })
        .catch(e => {
          this.table.selected.data = {};
          this.setError(e);
        });
    },
    async getPermissionsHaveFromApi(path, startRow, count, filter, sortBy, descending, type) {
      const data = {
        load: type,
        page: startRow,
        limit: count,
        children: filter
      }

      // Sort by field descending or ascending
      if (sortBy) {
        const orderBy = descending ? 'desc' : 'asc'
        data.sortBy = JSON.stringify({
          key: sortBy,
          order: orderBy
        })
      }

      if(type === 'users'){
        data.name = this.table.users.search.name ?? ''
        data.username = this.table.users.search.username ?? ''
        data.email = this.table.users.search.email ?? ''
        data.role = this.table.users.search.role ?? ''
      }

      try {
        const params = new URLSearchParams(data);
        const response = await api.post(path, params)
        return response.data
      } catch (e) {
        this.setError(e)
      }
    },

    async loadPermissionsHave(path, props, type){
      const {page, rowsPerPage, sortBy, descending} = props.pagination
      const filter = props.filter

      this.table.loading = true

      // emulate server
      // update rowsCount with appropriate value

      // get all rows if "All" (0) is selected
      const fetchCount = rowsPerPage === 0 ? this.table[type].pagination.rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      const returnedData = await this.getPermissionsHaveFromApi(path, page, fetchCount, filter, sortBy, descending, type)

      // clear out existing data and add new
      this.table[type].data = returnedData.data

      if(type === 'users'){
        this.table[type].roles = returnedData.roles
      }

      // update only rowsNumber = total rows
      this.table[type].pagination.rowsNumber = returnedData.meta.total

      // don't forget to update local pagination object
      this.table[type].pagination.page = page
      this.table[type].pagination.rowsPerPage = rowsPerPage
      this.table[type].pagination.sortBy = sortBy
      this.table[type].pagination.descending = descending


      // ...and turn of loading indicator
      this.table[type].loading = false
      return true
    }
  }

})
