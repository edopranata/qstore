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
    <DialogDelete/>
    <DialogEdit/>
    <DialogCreate/>
    <q-card>
      <q-table
        ref="tableRolesRef"
        v-model:pagination="table.pagination"
        v-model:selected="table.selected"
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        :selection="can('app.management.roles.deleteRole') ? 'multiple' : 'single'"
        binary-state-sort
        bordered
        row-key="id"
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
                :dense="$q.screen.lt.md"
                :disable="!table.selected.length > 0"
                :label="!$q.screen.lt.md ? 'Delete' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
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
                v-if="can('app.management.roles.updateRole')"
                :dense="$q.screen.lt.md"
                :disable="table.selected.length !== 1"
                :label="!$q.screen.lt.md ? 'Edit Data' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
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
                v-if="can('app.management.roles.createRole')"
                :dense="$q.screen.lt.md"
                :label="!$q.screen.lt.md ? 'Create New' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                color="secondary"
                glossy
                icon="add_circle"
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
              :label="!$q.screen.lt.md ? 'Show' : ''"
              :loading="table.loading"
              :round="$q.screen.lt.md"
              :size="$q.screen.lt.md ? 'xs' : 'sm'"
              :to="'roles/' + props.row.id + '/view'"
              color="white"
              icon="visibility"
              text-color="black"
            />
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

