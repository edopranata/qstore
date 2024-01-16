<script setup>
import {usePermissionsStore} from "stores/management/permissions";
import {useAuthStore} from "stores/authStore";
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import {api} from "boot/axios";

const {table, trees} = usePermissionsStore()
const permission = usePermissionsStore()
const {can} = useAuthStore()
const {path} = useRoute()
const tableRef = ref()
const splitterModel = ref(25)

const onRequest = async (props) => {
  await permission.getPermissionsData(path, props)
}

const loadChild = ({node, key, done, fail}) => {
  table.loading = true
  const data = {
    parent: key,
  }
  const params = new URLSearchParams(data);

  api.get(path, {params}).then(response => {
    done(response.data)
  }).catch( () => {
    fail(node)
  }).finally(() => table.loading = false)
  table.loading = false
}

onMounted(async () => {
  await permission.getPermissionTree(path)
})
</script>

<template>
  <q-page padding>
    <q-dialog v-model="table.dialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Anda yakin akan melakukan sinkronisasi?</span>
        </q-card-section>

        <q-card-actions class="tw-flex justify-between">
          <q-btn :disable="table.loading" :loading="table.loading" flat label="Batalkan" color="primary" v-close-popup />
          <q-btn :disable="table.loading" :loading="table.loading" flat label="Sinkron" color="primary" @click.prevent="permission.syncNewPermissions(path)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card title="Permission List">
      <q-splitter
        v-model="splitterModel"
      >
        <template v-slot:before>
          <q-card flat>
            <q-card-section>
              <q-toolbar class="text-primary">
                <q-toolbar-title>
                  Select Permission
                </q-toolbar-title>
              </q-toolbar>
              <q-tree
                v-model:selected="table.filter"
                :nodes="trees.data"
                default-expand-all
                node-key="label"
                selected-color="primary"
                @lazy-load="loadChild"
              />
            </q-card-section>

          </q-card>

        </template>
        <template v-slot:after>
          <q-table
            ref="tableRef"
            v-model:pagination="table.pagination"
            :columns="table.headers ?? []"
            :filter="table.filter"
            :loading="table.loading"
            :rows="table.data ?? []"
            binary-state-sort
            flat
            row-key="id"
            @request="onRequest"
          >
            <template v-slot:top>
              <q-toolbar class="text-primary">
                <q-toolbar-title>
                  {{ !table.filter ? 'Permission' : 'Permission ' + table.filter }}
                </q-toolbar-title>
                <div
                  class="tw-space-x-2">
                  <q-btn
                    :disable="table.loading"
                    :loading="table.loading"
                    v-if="can('app.management.permissions.syncPermissions')"
                    color="primary"
                    glossy
                    icon="sync"
                    label="Sync"
                    @click.prevent="table.dialog=true"
                  >
                    <q-tooltip>
                      Synchronize Permissions
                    </q-tooltip>
                  </q-btn>
                </div>

              </q-toolbar>
            </template>
            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
            <template v-slot:body-cell-action="props">
              <q-td :props="props">
                <q-btn
                  :to="'permissions/' + props.row.id + '/view'"
                  :loading="table.loading"
                  :disable="!can('app.management.permissions.viewPermission')"
                  size="sm"
                  color="white"
                  text-color="black"
                  icon="visibility"
                  label="View" />
              </q-td>
            </template>
          </q-table>
        </template>
      </q-splitter>
    </q-card>
  </q-page>
</template>
