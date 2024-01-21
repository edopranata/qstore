<script setup>
import {useAreasStore} from "stores/data/area";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogDelete from "pages/app/masterData/area/dialog/DialogDelete.vue";
import DialogCreate from "pages/app/masterData/area/dialog/DialogCreate.vue";
import DialogEdit from "pages/app/masterData/area/dialog/DialogEdit.vue";

const {table, openDialog, dialog, form, deleted} = useAreasStore()
const areas = useAreasStore()
const {can} = useAuthStore()
const {getSelected: selected} = storeToRefs(useAreasStore())
const {path} = useRoute()

const tableRef = ref()

async function onRequest(props) {
  await areas.getAreasData(path, props)
}

watch(table.search, () => {
  table.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})
watch(dialog, () => {
  for (let property in dialog) {
    if (dialog[property]) {
      areas.errors = {}
    }

  }
  if (dialog.create) {
    table.selected = [];
  }
})

watch(selected, (selected_item) => {
  if (selected_item.length > 0) {
    deleted.area_id = selected_item.map(i => i['id'])
    deleted.data = selected_item.map(i => i['name'])

    if (selected_item.length === 1) {
      form.id = selected_item[0].id
      form.name = selected_item[0].name
    } else {
      areas.onReset()
    }
  } else {
    areas.onReset()
    deleted.area_id = []
    deleted.data = []
  }
}, {
  deep: true,
})
onMounted(() => {
  // get initial data from server (1st page)
  tableRef.value.requestServerInteraction()
})

</script>

<template>
  <q-page padding>
    <DialogDelete/>
    <DialogCreate/>
    <DialogEdit/>
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
        :selection="can('app.masterData.areas.[deleteArea]') ? 'multiple' :'single'"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Areas Data
            </q-toolbar-title>
            <div v-if="can('app.masterData.areas.[createArea,updateArea,deleteArea]')"
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.masterData.areas.deleteArea')"
                :dense="$q.screen.lt.md"
                :disable="!selected.length > 0"
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
                v-if="can('app.masterData.areas.updateArea')"
                :dense="$q.screen.lt.md"
                :disable="selected.length !== 1"
                :label="!$q.screen.lt.md ? 'Edit Data' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                color="warning"
                glossy
                icon="edit"
                @click.prevent="openDialog('edit')"
              >
                <q-tooltip v-if="selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.masterData.areas.createArea')"
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
            <q-th>
              <q-input v-model="table.search.name" :loading="table.loading" clearable debounce="500" dense
                       label="Search Name"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.user" :loading="table.loading" clearable debounce="500" dense
                       label="Search Create By"/>
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
