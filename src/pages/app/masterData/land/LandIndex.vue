<script setup>
import {useLandsStore} from "stores/data/land";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogDelete from "pages/app/masterData/land/dialog/DialogDelete.vue";
import DialogCreate from "pages/app/masterData/land/dialog/DialogCreate.vue";
import DialogEdit from "pages/app/masterData/land/dialog/DialogEdit.vue";

const {table, openDialog, dialog, form, deleted} = useLandsStore()
const lands = useLandsStore()
const {can} = useAuthStore()
const {getSelected: selected} = storeToRefs(useLandsStore())
const {path} = useRoute()

const tableRef = ref()

async function onRequest(props) {
  await lands.getLandsData(path, props)
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
      lands.errors = {}
    }
  }
  if (dialog.create) {
    table.selected = [];
    lands.onReset('create')
  }
})

watch(selected, (selected_item) => {
  if (selected_item.length > 0) {
    deleted.land_id = selected_item.map(i => i['id'])
    deleted.data = selected_item.map(i => i['name'])

    if (selected_item.length === 1) {
      form.id = selected_item[0].id
      form.name = selected_item[0].name
      form.area_id = selected_item[0].area_id
      form.wide = selected_item[0].wide
      form.trees = selected_item[0].trees
    } else {
      lands.onReset()
    }
  } else {
    lands.onReset()
    deleted.land_id = []
    deleted.data = []
  }
}, {
  deep: true,
})
onMounted(() => {
  lands.onReset()
  table.selected = []
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
        :selection="can('app.masterData.lands.[deleteLand]') ? 'multiple' :'single'"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Lands Data
            </q-toolbar-title>
            <div v-if="can('app.masterData.lands.[createLand,updateLand,deleteLand]')"
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.masterData.lands.deleteLand')"
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
                v-if="can('app.masterData.lands.updateLand')"
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
                v-if="can('app.masterData.lands.createLand')"
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
            <q-th class="text-left">
              <q-select
                v-model="table.search.area_id"
                :loading="table.loading"
                :options="table.areas"
                clearable
                dense
                emit-value
                fill-input
                label="Search Area"
                map-options
                option-label="name"
                option-value="id"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.name" :loading="table.loading" clearable debounce="500" dense
                       label="Search Name"/>
            </q-th>
            <q-th></q-th>
            <q-th></q-th>
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
