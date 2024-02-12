<script setup>
import {useCarsStore} from "stores/data/car";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogDelete from "pages/app/masterData/car/dialog/DialogDelete.vue";
import DialogCreate from "pages/app/masterData/car/dialog/DialogCreate.vue";
import DialogEdit from "pages/app/masterData/car/dialog/DialogEdit.vue";

const {table, openDialog, dialog, form, deleted} = useCarsStore()
const cars = useCarsStore()
const {can} = useAuthStore()
const {getSelected: selected} = storeToRefs(useCarsStore())
const {path} = useRoute()

const tableRef = ref()

async function onRequest(props) {
  await cars.getCarsData(path, props)
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
      cars.errors = {}
    }
  }
  if (dialog.create) {
    table.selected = [];
  }
})

watch(selected, (selected_item) => {
  if (selected_item.length > 0) {
    deleted.car_id = selected_item.map(i => i['id'])
    deleted.data = selected_item.map(i => i['name'] + ' ' + i['no_pol'])

    if (selected_item.length === 1) {
      form.id = selected_item[0].id
      form.name = selected_item[0].name
      form.status = selected_item[0].status
      form.no_pol = selected_item[0].no_pol
      form.description = selected_item[0].description
      form.year = selected_item[0].year
    } else {
      cars.onReset()
    }
  } else {
    cars.onReset()
    deleted.car_id = []
    deleted.data = []
  }
}, {
  deep: true,
})
onMounted(() => {
  cars.onReset()
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
        :selection="can('app.masterData.mobil.[deleteCar]') ? 'multiple' :'single'"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Cars Data
            </q-toolbar-title>
            <div v-if="can('app.masterData.mobil.[createCar,updateCar,deleteCar]')"
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.masterData.mobil.deleteCar')"
                :disable="!selected.length > 0"
                :label="!$q.screen.lt.md ? 'Delete' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                color="negative"
                :dense="$q.screen.lt.md"
                glossy
                icon="delete"
                @click.prevent="openDialog('delete')"
              >
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.masterData.mobil.updateCar')"
                :disable="selected.length !== 1"
                :label="!$q.screen.lt.md ? 'Edit Data' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                color="warning"
                :dense="$q.screen.lt.md"
                glossy
                icon="edit"
                @click.prevent="openDialog('edit')"
              >
                <q-tooltip v-if="selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.masterData.mobil.createCar')"
                :label="!$q.screen.lt.md ? 'Create New' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                color="secondary"
                :dense="$q.screen.lt.md"
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
              <q-select
                v-model="table.search.status"
                :options="table.car_status"
                clearable
                dense
                emit-value
                label="Status Kepemilikan"
                map-options
                option-label="desc"
                option-value="id"
              />
            </q-th>
            <q-th>
              <q-input v-model="table.search.name" :loading="table.loading" clearable debounce="500" dense
                       label="Search Name"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.no_pol" :loading="table.loading" clearable debounce="500" dense
                       label="Search Plat No"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.year" :loading="table.loading" clearable debounce="500" dense
                       label="Search Year"/>
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
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            {{ props.value === 'yes' ? 'Milik Sendiri' : 'Tidak' }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>
