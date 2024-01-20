<script setup>
import {useCustomersStore} from "stores/data/customer";
import {useAuthStore} from "stores/authStore";
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";
import DialogDelete from "pages/app/masterData/customer/dialog/DialogDelete.vue";
import DialogCreate from "pages/app/masterData/customer/dialog/DialogCreate.vue";
import DialogEdit from "pages/app/masterData/customer/dialog/DialogEdit.vue";

const {table, openDialog, dialog, form, deleted} = useCustomersStore()
const customers = useCustomersStore()
const {can} = useAuthStore()
const {getSelected: selected, customers: customer_model} = storeToRefs(useCustomersStore())
const {path} = useRoute()

const tableRef = ref()

async function onRequest(props) {
  await customers.getCustomersData(path, props)
}

watch(table.search, () => {
  table.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})
watch(dialog, () => {
  if (dialog.create) {
    table.selected = [];
  }
})
watch(table, (selected_item) => {
  if (selected_item.selected.length > 0) {
    deleted.customer_id = selected_item.selected.map(i => i['id'])
    deleted.data = selected_item.selected.map(i => `${i['name']} ${i['type'] = 'farmer' ? 'Petani' : 'Pengepul'}`)

    if (selected_item.selected.length === 1) {
      form.id = selected_item.selected[0].id
      form.name = selected_item.selected[0].name
      form.type = selected_item.selected[0].type
      form.phone = selected_item.selected[0].phone
      form.address = selected_item.selected[0].address
      form.distance = selected_item.selected[0].distance
    } else {
      customers.onReset()
    }
  } else {
    customers.onReset()
    deleted.customer_id = []
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
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        :selection="can('app.masterData.customers.[deleteCustomer]') ? 'multiple' :'single'"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Customers Data
            </q-toolbar-title>
            <div v-if="can('app.masterData.customers.[createCustomer,updateCustomer,deleteCustomer]')"
                 class="tw-space-x-2">
              <q-btn
                v-if="can('app.masterData.customers.deleteCustomer')"
                :disable="!selected.length > 0"
                :loading="table.loading"
                color="negative"
                glossy
                icon="delete"
                label="Delete"
                @click.prevent="openDialog('delete')"
              >
                <q-tooltip>
                  Delete
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.masterData.customers.updateCustomer')"
                :disable="selected.length !== 1"
                :loading="table.loading"
                color="warning"
                glossy
                icon="edit"
                label="Edit Data"
                @click.prevent="openDialog('edit')"
              >
                <q-tooltip v-if="selected.length !== 1">
                  Edit Data
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.masterData.customers.createCustomer')"
                :loading="table.loading"
                color="secondary"
                glossy
                icon="add_circle"
                label="Create New"
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
                dense
                clearable
                v-model="table.search.type"
                :options="customer_model"
                option-value="id"
                option-label="desc"
                option-disable="inactive"
                emit-value
                map-options
                label="Search Customer Type"
              />
            </q-th>
            <q-th>
              <q-input v-model="table.search.name" :loading="table.loading" clearable debounce="500" dense
                       label="Search Name"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.phone" :loading="table.loading" clearable debounce="500" dense
                       label="Search Phone"/>
            </q-th>
            <q-th>
              <q-input v-model="table.search.address" :loading="table.loading" clearable debounce="500" dense
                       label="Search Address"/>
            </q-th>
            <q-th>
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
