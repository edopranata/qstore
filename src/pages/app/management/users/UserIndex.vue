<script setup>
import {useUsersStore} from "stores/management/users";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogCreate from "pages/app/management/users/Dialog/DialogCreate.vue";
import DialogEdit from "pages/app/management/users/Dialog/DialogEdit.vue";
import DialogDelete from "pages/app/management/users/Dialog/DialogDelete.vue";
import DialogChange from "pages/app/management/users/Dialog/DialogChange.vue";

const {table, openDialog, dialog, form} = useUsersStore()
const users = useUsersStore()
const {can} = useAuthStore()
const {getSelected: selected} = storeToRefs(useUsersStore())
const {path} = useRoute()
const tableRef = ref()

async function onRequest(props) {
  await users.getUsersData(path, props)
}

watch(table.search, () => {
  table.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})

watch(dialog, (newDialog) => {
  if (newDialog.edit) {
    if (table.selected.length === 1) {
      form.edit.id = table.selected[0].id
      form.edit.name = table.selected[0].name
      form.edit.username = table.selected[0].username
      form.edit.email = table.selected[0].email
      form.edit.role = table.selected[0].roles[0]
    }
  }
  if (newDialog.password) {
    if (table.selected.length === 1) {
      form.password.id = table.selected[0].id
      form.password.name = table.selected[0].name
      form.password.username = table.selected[0].username
      form.password.email = table.selected[0].email
      form.password.role = table.selected[0].roles[0]
    }
  }
  if (newDialog.delete) {
    if (table.selected.length > 0) {
      console.log(dialog.delete)
      form.delete.user_id = table.selected.map(i => i['id'])
      form.delete_data = table.selected.map(i => i['name'])
    }
  }
}, {
  deep: true,
  immediate: true
})
onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})

</script>

<template>
  <q-page padding>
    <DialogDelete v-if="dialog.delete && can('app.management.users.deleteUser')"/>
    <DialogEdit v-if="dialog.edit && can('app.management.users.updateUser')"/>
    <DialogChange v-if="dialog.password && can('app.management.users.resetPassword')"/>
    <DialogCreate v-if="dialog.create && can('app.management.users.createUser')"/>
    <q-card>
      <q-table
        ref="tableRef"
        v-model:pagination="table.pagination"
        v-model:selected="table.selected"
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        :selection="can('app.management.users.[deleteUser]') ? 'multiple' :'single'"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Users Data
            </q-toolbar-title>
            <div v-if="can('app.management.users.[createUser,updateUser,deleteUser,resetPassword]')"
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.management.users.deleteUser')"
                :dense="$q.screen.lt.md"
                :label="!$q.screen.lt.md ? 'Delete' : ''"
                :disable="!table.selected.length > 0"
                :round="$q.screen.lt.md"
                :loading="table.loading"
                color="negative"
                glossy
                icon="delete"
                @click.prevent="openDialog('delete')"
              >
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.management.users.updateUser')"
                :dense="$q.screen.lt.md"
                :label="!$q.screen.lt.md ? 'Edit Data' : ''"
                :disable="table.selected.length !== 1"
                :round="$q.screen.lt.md"
                :loading="table.loading"
                color="warning"
                glossy
                icon="edit"
                @click.prevent="openDialog('edit')"
              >
                <q-tooltip v-if="table.selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.management.users.resetPassword')"
                :dense="$q.screen.lt.md"
                :label="!$q.screen.lt.md ? 'Change Password' : ''"
                :disable="table.selected.length !== 1"
                :round="$q.screen.lt.md"
                :loading="table.loading"
                color="accent"
                glossy
                icon="password"
                @click.prevent="openDialog('password')"
              >
                <q-tooltip>
                  Change Password
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.management.users.createUser')"
                :dense="$q.screen.lt.md"
                :label="!$q.screen.lt.md ? 'Create New' : ''"
                :round="$q.screen.lt.md"
                :loading="table.loading"
                color="secondary"
                glossy
                icon="add_circle"
                @click.prevent="openDialog('create')"
              >
                <q-tooltip>
                  Create new user
                </q-tooltip>
              </q-btn>
            </div>

          </q-toolbar>
        </template>
        <template v-slot:top-row>
          <q-tr>
            <q-th></q-th>
            <q-th class="text-left">#</q-th>
            <q-th>
              <q-input v-model="table.search.name" :loading="table.loading" clearable debounce="500" dense
                       label="Search Name"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.username" :loading="table.loading" clearable debounce="500" dense
                       label="Search Username"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.email" :loading="table.loading" clearable debounce="500" dense
                       label="Search Email"/>
            </q-th>
            <q-th>
              <q-select v-model="table.search.role" :loading="table.loading" :options="table.roles" clearable dense
                        label="Roles"/>
            </q-th>
            <q-th></q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
