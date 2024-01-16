<script setup>
import {usePermissionsStore} from "stores/management/permissions";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";

const {table} = usePermissionsStore()
const permission = usePermissionsStore()
const {path} = useRoute();
const tableRef = ref()
const tableRefRoles = ref()
const tableRefUsers = ref()
onMounted(async () => {
  tableRef.value.requestServerInteraction()
  tableRefRoles.value.requestServerInteraction()
  tableRefUsers.value.requestServerInteraction()

})

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
  <q-page padding>
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
        bordered
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
      <q-card-section>
        <div class="tw-flex tw-flex-col justify-between md:tw-space-x-4 md:tw-flex-row">
          <q-card class="tw-flex-none" flat>
            <q-card-section>
              <div class="text-h6">List Role</div>
            </q-card-section>

            <q-card-section class="q-pa-none">
              <q-table
                ref="tableRefRoles"
                v-model:pagination="table.roles.pagination"
                :columns="table.roles.headers ?? []"
                :loading="table.roles.loading"
                :rows="table.roles.data ?? []"
                binary-state-sort
                bordered
                flat
                row-key="id"
                @request="onRequestRolesHavePermission"
              >
              </q-table>
            </q-card-section>
          </q-card>
          <q-card class="tw-w-full" flat>
            <q-card-section>
              <div class="text-h6">List User</div>
            </q-card-section>

            <q-card-section class="q-pa-none">
              <q-table
                ref="tableRefUsers"
                v-model:pagination="table.users.pagination"
                :columns="table.users.headers ?? []"
                :loading="table.users.loading"
                :rows="table.users.data ?? []"
                binary-state-sort
                bordered
                flat
                row-key="id"
                separator="vertical"
                @request="onRequestUsersHavePermission"
              >
                <template v-slot:body-cell-no="props">
                  <q-td :props="props">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                </template>
              </q-table>
            </q-card-section>

          </q-card>
        </div>

      </q-card-section>
    </q-card>
  </q-page>
</template>
