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
  }).catch(() => {
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
          <q-btn v-close-popup :disable="table.loading" :loading="table.loading" color="primary" flat label="Batalkan"/>
          <q-btn :disable="table.loading" :loading="table.loading" color="primary" flat label="Sinkron"
                 @click.prevent="permission.syncNewPermissions(path)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="tw-flex tw-space-y-4 tw-flex-col md:tw-space-x-4 md:tw-space-y-0 md:tw-flex-row">
      <q-card class="md:tw-flex-none md:tw-w-80 tw-w-full">
        <q-card-section>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Select Permission
            </q-toolbar-title>
          </q-toolbar>
          <q-tree
            v-model:selected="table.filter"
            :dense="$q.screen.lt.md"
            :nodes="trees.data"
            default-expand-all
            node-key="label"
            selected-color="primary"
            @lazy-load="loadChild"
          />
        </q-card-section>

      </q-card>

      <q-card class="tw-flex-grow">
        <q-table
          ref="tableRef"
          v-model:pagination="table.pagination"
          :columns="table.headers ?? []"
          :dense="$q.screen.lt.md"
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
                  v-if="can('app.management.permissions.syncPermissions')"
                  :disable="table.loading"
                  :label="!$q.screen.lt.md ? 'Sync' : ''"
                  :loading="table.loading"
                  :round="$q.screen.lt.md"
                  color="primary"
                  dense
                  glossy
                  icon="sync"
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
                :disable="!can('app.management.permissions.viewPermission')"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                :size="$q.screen.lt.md ? 'xs' : 'sm'"
                :to="'permissions/' + props.row.id + '/view'"
                color="white"
                icon="visibility"
                text-color="black">
                <template v-if="!$q.screen.lt.md" v-slot:default>
                  View
                </template>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>
  </q-page>
</template>
