<script setup>
import {useRolesStore} from "stores/management/roles";
import {useAuthStore} from "stores/authStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";

const {can} = useAuthStore()
const {table, view, addPermissionsToRole, loadPermissionList, dialog, openDialog} = useRolesStore()
const roles = useRolesStore()
const {path} = useRoute();
onMounted(async () => {
  await roles.loadPermissionList(path)
})

</script>

<template>
  <q-page padding>
    <q-dialog v-model="dialog.update" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="check"/>
          <span class="q-ml-sm">Set Permissions to role {{ view.selected?.name }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn :loading="table.loading" flat label="Batal" color="negative" v-close-popup />
          <q-btn :loading="table.loading" flat label="Update permission" color="primary" @click.prevent="addPermissionsToRole(path)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section>
        <q-toolbar class="text-primary">
          <q-toolbar-title class="text-h5 text-primary">
            {{ `Role ${view.selected?.name}` }}
          </q-toolbar-title>
          <div class="tw-space-x-2">
            <q-btn
              :loading="table.loading"
              color="primary"
              glossy
              icon="sync"
              label="Reload"
              @click.prevent="loadPermissionList(path)"
            >
              <q-tooltip>
                Refresh permission list
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="can('app.management.roles.addPermissionsToRole')"
              :loading="table.loading"
              color="secondary"
              glossy
              icon="check"
              label="Update Permission"
              @click.prevent="openDialog('update')"
            >
              <q-tooltip>
                Refresh permission list
              </q-tooltip>
            </q-btn>
          </div>

        </q-toolbar>
      </q-card-section>

      <q-card-section
        v-for="(name, parent) in view.all"
        :key="`${parent}`"
      >
        <q-markup-table
          bordered
          flat>
          <thead>
          <tr>
            <th colspan="2">
              <div class="row no-wrap items-center">
                <div class="text-h6 text-secondary">{{ parent }}</div>
              </div>
            </th>
          </tr>
          <tr>
            <th class="text-left" style="width: 260px">Menu Name</th>
            <th class="text-left">Permission Access</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, child) in name" :key="child">
            <td class="text-left tw-align-text-top" style="max-width: 160px; min-width: 80px">{{ child }}</td>
            <td class="text-left">
              <div class="tw-grid lg:tw-grid-cols-5 md:tw-grid-cols-3 tw-gap-1">
                <q-skeleton
                  v-show="table.loading"
                  v-for="permission in item"
                  :key="permission.id"
                  type="QChip"/>
                <q-checkbox
                  :disable="!can('app.management.roles.addPermissionsToRole')"
                  v-show="!table.loading"
                  v-for="(permission, i) in item"
                  :key="i"
                  v-model="view.active"
                  :label="permission.title"
                  :val="permission.name"
                  color="teal"/>
              </div>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
