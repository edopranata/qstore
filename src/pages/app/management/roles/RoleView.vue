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
          <q-btn v-close-popup :loading="table.loading" color="negative" flat label="Batal"/>
          <q-btn :loading="table.loading" color="primary" flat label="Update permission"
                 @click.prevent="addPermissionsToRole(path)"/>
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
              :dense="$q.screen.lt.md"
              :label="!$q.screen.lt.md ? 'Reload' : ''"
              :loading="table.loading"
              :round="$q.screen.lt.md"
              color="primary"
              glossy
              icon="sync"
              @click.prevent="loadPermissionList(path)"
            >
              <q-tooltip>
                Refresh permission list
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="can('app.management.roles.addPermissionsToRole')"
              :dense="$q.screen.lt.md"
              :label="!$q.screen.lt.md ? 'Update Permissions' : ''"
              :loading="table.loading"
              :round="$q.screen.lt.md"
              color="secondary"
              glossy
              icon="check"
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
          :dense="$q.screen.lt.md"
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
                  v-for="permission in item"
                  v-show="table.loading"
                  :key="permission.id"
                  type="QChip"/>
                <q-checkbox
                  v-for="(permission, i) in item"
                  v-show="!table.loading"
                  :key="i"
                  v-model="view.active"
                  :dense="$q.screen.lt.md"
                  :disable="!can('app.management.roles.addPermissionsToRole')"
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
