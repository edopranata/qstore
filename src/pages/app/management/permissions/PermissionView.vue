<script setup>
import {usePermissionsStore} from "stores/management/permissions";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";

const {table} = usePermissionsStore()
const permission = usePermissionsStore()
const {path} = useRoute();
const tableRef = ref()
const tableRefRoles = ref()
const tableRefUsers = ref()

const roles = ref(table.users.roles)

onMounted(async () => {
  tableRef.value.requestServerInteraction()
  tableRefRoles.value.requestServerInteraction()
  tableRefUsers.value.requestServerInteraction()
})

watch(table.users.search, () => {
  table.users.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})

const filterRole = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    roles.value = table.users.roles.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}
const onRequest = async () => {
  await permission.viewPermission(path)
}
const onRequestUsersHavePermission = async (props) => {
  await permission.loadPermissionsHave(path, props, 'users')
}

const onRequestRolesHavePermission = async (props) => {
  await permission.loadPermissionsHave(path, props, 'roles')
}
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-card bordered class="my-card">
      <q-card-section>
        <div class="text-h6">Permission</div>
        <div class="text-subtitle2">Daftar user dan role yang memiliki permission:</div>
      </q-card-section>

      <q-table
        ref="tableRef"
        :columns="table.selected.headers ?? []"
        :loading="table.selected.loading"
        :rows="table.selected.data ?? []"
        binary-state-sort
        :bordered="!$q.screen.lt.md"
        :flat="$q.screen.lt.md"
        :grid="$q.screen.lt.md"
        hide-bottom
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:body-cell-grouped="props">
          <q-td :props="props">
            {{ props.row.parent }} - {{ props.row.children }}
          </q-td>
        </template>
      </q-table>
    </q-card>

    <div class="tw-flex tw-flex-col justify-between md:tw-space-x-4 md:tw-flex-row">
      <q-card class="tw-flex-none" flat>
        <q-card-section class="q-pa-none">
          <q-table
            ref="tableRefRoles"
            v-model:pagination="table.roles.pagination"
            :columns="table.roles.headers ?? []"
            :loading="table.roles.loading"
            :rows="table.roles.data ?? []"
            :dense="$q.screen.lt.md"
            binary-state-sort
            bordered
            row-key="id"
            @request="onRequestRolesHavePermission"
          >
            <template v-slot:top>
              <div class="text-h6">List Roles</div>
            </template>
            <template v-slot:body-cell-no="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
      <q-card class="tw-w-full" flat>
        <q-card-section class="q-pa-none">
          <q-table
            ref="tableRefUsers"
            v-model:pagination="table.users.pagination"
            :columns="table.users.headers ?? []"
            :filter="table.users.filter"
            :loading="table.users.loading"
            :rows="table.users.data ?? []"
            :dense="$q.screen.lt.md"
            binary-state-sort
            bordered
            row-key="id"
            @request="onRequestUsersHavePermission"
          >

            <template v-slot:top>
              <div class="text-h6">List Users</div>
            </template>

            <template v-slot:top-row>
              <q-tr>
                <q-th></q-th>
                <q-th>
                  <q-input
                    v-model="table.users.search.name"
                    :loading="table.users.loading"
                    clearable
                    debounce="500"
                    dense
                    label="Search Name"/>
                </q-th>
                <q-th>
                  <q-input
                    v-model="table.users.search.username"
                    :loading="table.users.loading"
                    clearable
                    debounce="500"
                    dense
                    label="Search Username"/>
                </q-th>
                <q-th>
                  <q-input
                    v-model="table.users.search.email"
                    :loading="table.users.loading"
                    clearable
                    debounce="500"
                    dense
                    label="Search Email"/>
                </q-th>
                <q-th>
                  <q-select
                    v-model="table.users.search.role"
                    :loading="table.users.loading"
                    class="tw-w-32"
                    :options="roles"
                    clearable
                    dense
                    fill-input
                    hide-selected
                    input-debounce="0"
                    label="Roles"
                    use-input
                    @filter="filterRole"/>
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body-cell-no="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
