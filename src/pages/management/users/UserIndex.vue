<script setup>
import {useUsersStore} from "stores/management/users";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogCreate from "pages/management/users/Dialog/DialogCreate.vue";
import DialogEdit from "pages/management/users/Dialog/DialogEdit.vue";
import DialogDelete from "pages/management/users/Dialog/DialogDelete.vue";
import DialogChange from "pages/management/users/Dialog/DialogChange.vue";

const {table, getUsersData, openDialog, dialog, form} = useUsersStore()
const {getSelected: selected} = storeToRefs(useUsersStore())
const {path} = useRoute()

const tableRef = ref()

async function onRequest(props) {
  await getUsersData(path, props)
}

watch(table.search, (newSearch) => {
  table.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})

watch(dialog, (newDialog) => {
  if(newDialog.edit){
    if(table.selected.length === 1){
      form.edit.id = table.selected[0].id
      form.edit.name = table.selected[0].name
      form.edit.username = table.selected[0].username
      form.edit.email = table.selected[0].email
      form.edit.role = table.selected[0].roles[0]
    }
  }
  if(newDialog.password){
    if(table.selected.length === 1){
      form.password.id = table.selected[0].id
      form.password.name = table.selected[0].name
      form.password.username = table.selected[0].username
      form.password.email = table.selected[0].email
      form.password.role = table.selected[0].roles[0]
    }
  }
  if(newDialog.delete){
    if(table.selected.length > 0){
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
    <DialogCreate v-if="dialog.create" />
    <DialogEdit v-if="dialog.edit" />
    <DialogDelete v-if="dialog.delete" />
    <DialogChange v-if="dialog.password" />
    <q-card>
      <q-table
        ref="tableRef"
        v-model:pagination="table.pagination"
        v-model:selected="table.selected"
        selection="multiple"
        :columns="table.headers ?? []"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              {{ selected }}
            </q-toolbar-title>
            <div class="tw-space-x-2">
              <q-btn color="negative" :disable="!table.selected.length > 0" round dense icon="delete" @click.prevent="openDialog('delete')">
                <q-tooltip>
                  Delete {{ table.selected.length > 0 ? table.selected.length + ' data' : ''}}
                </q-tooltip>
              </q-btn>
              <q-btn color="warning" :disable="table.selected.length !== 1" round dense icon="edit" @click.prevent="openDialog('edit')">
                <q-tooltip v-if="table.selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn color="accent" :disable="!table.selected.length > 0" round dense icon="password" @click.prevent="openDialog('password')">
              <q-tooltip>
                Change Password
              </q-tooltip>
            </q-btn>
              <q-btn color="positive" round dense icon="add_circle" @click.prevent="openDialog('create')">
                <q-tooltip>
                  Create new
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
              <q-input :loading="table.loading" dense debounce="500" clearable v-model="table.search.name" label="Search Name" />
            </q-th>
            <q-th>
              <q-input :loading="table.loading" dense debounce="500" clearable v-model="table.search.username" label="Search Username" />
            </q-th>
            <q-th>
              <q-input :loading="table.loading" dense debounce="500" clearable v-model="table.search.email" label="Search Email" />
            </q-th>
            <q-th>
              <q-select :loading="table.loading" dense clearable v-model="table.search.role" :options="table.roles" label="Roles" />
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
