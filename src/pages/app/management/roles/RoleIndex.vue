<script setup>
import {useRolesStore} from "stores/management/roles";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import DialogDelete from "pages/app/management/roles/Dialog/DialogDelete.vue";
import DialogEdit from "pages/app/management/roles/Dialog/DialogEdit.vue";
import DialogCreate from "pages/app/management/roles/Dialog/DialogCreate.vue";

const {path} = useRoute()
const {can} = useAuthStore()
const {table, form, dialog, openDialog} = useRolesStore()
const roles = useRolesStore()

const tableRolesRef = ref()
const onRequest = async (props) => {
  await roles.getRolesData(path, props)
}

onMounted(async () => {
  tableRolesRef.value.requestServerInteraction()
})
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
    }
  }
  if (newDialog.delete) {
    if (table.selected.length > 0) {
      form.delete.roles_id = table.selected.map(i => i['id'])
      form.delete_data = table.selected.map(i => i['name'])
    }
  }
}, {
  deep: true,
  immediate: true
})
</script>

<template>
  <q-page padding>
    <DialogDelete />
    <DialogEdit />
    <DialogCreate />
    <q-card>
      <q-table
        ref="tableRolesRef"
        v-model:pagination="table.pagination"
        v-model:selected="table.selected"
        :columns="table.headers ?? []"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        :selection="can('app.management.roles.deleteRole') ? 'multiple' : 'single'"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Roles list
            </q-toolbar-title>
            <div
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.management.roles.deleteRole')"
                :disable="!table.selected.length > 0"
                :loading="table.loading"
                color="negative"
                glossy
                icon="delete"
                label="Delete"
                @click.prevent="openDialog('delete')"
              >
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.management.roles.updateRole')"
                :disable="table.selected.length !== 1"
                :loading="table.loading"
                color="warning"
                glossy
                icon="edit"
                label="Edit Data"
                @click.prevent="openDialog('edit')"
              >
                <q-tooltip v-if="table.selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.management.roles.createRole')"
                :loading="table.loading"
                color="secondary"
                glossy
                icon="add_circle"
                label="Create New"
                @click.prevent="openDialog('create')"
              >
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
            <q-th></q-th>
            <q-th>
              <q-input
                v-model="table.search.name"
                :loading="table.loading"
                clearable
                debounce="500"
                dense
                label="Search Name"/>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body-cell-id="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              :disable="!can('app.management.roles.viewRole')"
              :to="'roles/' + props.row.id + '/view'"
              :loading="table.loading"
              size="sm"
              color="white"
              text-color="black"
              icon="visibility"
              label="View" />
          </q-td>
        </template>
        <template v-slot:body-cell-permissions_count="props">
          <q-td :props="props">
            {{ props.value > 0 ? `${props.value} permissions` : '-' }}
          </q-td>
        </template>
        <template v-slot:body-cell-users_count="props">
        <q-td :props="props">
          {{ props.value > 0 ? `${props.value} users` : '-' }}
        </q-td>
      </template>
      </q-table>
    </q-card>
  </q-page>
</template>

