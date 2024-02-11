<script setup>
import {useLoanStore} from "stores/loan/loan";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useQuasar} from "quasar";

const {can} = useAuthStore()
const router = useRouter()
const {table, select} = useLoanStore()
const {path} = useRoute()
const {errors, getSelectedType} = storeToRefs(useLoanStore())
const loan = useLoanStore()

const $q = useQuasar()
const tableRef = ref()

onMounted(async () => {
  await loan.loadAllCustomers(path)
})

watch(getSelectedType, (selectedType) => {
  if (selectedType) {
    select.selected_customer = null
    table.data = []
  }
})

const getLoanList = () => {
  table.filter = String(Date.now())
}

const onRequest = async (props) => {
  await loan.getLoanData(path, props)
}

const onPrint = async (invoice) => {
  if (invoice)
    $q.dialog({
      title: 'Print invoice',
      message: `Invoice number : ${invoice}`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await router.replace({name: 'app.invoice.invoiceData.printInvoice', params: {invoice_number: invoice}})
    })
}

const searchCustomer = (val, update) => {
  update(() => {
    const customers = select.customers.filter(customer => customer.type === select.type)
    if (val !== '') {
      const needle = val.toLowerCase()
      select.customers_option = customers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1)
    } else {
      select.customers_option = customers.slice(0, 10)
    }
  })
}
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-card>
      <q-card-section>
        <q-toolbar class="text-primary">
          <q-toolbar-title>
            Data mutasi pinjaman
          </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-card-section class="tw-space-y-4">
        <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
          <div class="lg:tw-col-span-1 tw-col-span-2">
            <div class="q-gutter-sm md:tw-mb-11">
              <q-radio v-model="select.type" label="Petani" val="farmers"/>
              <q-radio v-model="select.type" label="Pengepul" val="collector"/>
              <q-radio v-model="select.type" label="Supir" val="driver"/>
            </div>
            <q-select
              v-if="!!select.type"
              v-model="select.selected_customer"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('customer_id')"
              :error-message="errors.customer_id"
              :options="select.customers_option"
              class="tw-w-full"
              clearable
              fill-input
              filled
              hide-selected
              label="Pelanggan"
              option-label="name"
              option-value="id"
              use-input
              @filter="searchCustomer"
              @update:model-value="getLoanList"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="person"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>
                      <q-icon name="boy"/>
                      {{ scope.opt.type }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    List empty
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="no-padding">
        <q-table
          v-model:pagination="table.pagination"
          v-model:selected="table.selected"
          :columns="table.headers ?? []"
          :dense="$q.screen.lt.md"
          :filter="table.filter"
          :loading="table.loading"
          :rows="table.data ?? []"
          binary-state-sort
          bordered
          flat
          row-key="id"
          @request="onRequest"
        >
          <template v-slot:body-cell-no="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-invoice="props">
            <q-td :props="props">
              <q-chip
                v-if="can('app.invoice.invoiceData.printInvoice')"
                clickable
                color="primary"
                icon="print"
                text-color="white"
                @click="onPrint(props.row.invoice?.invoice_number)">
                {{ props.row.invoice?.invoice_number }}
              </q-chip>
              <q-chip
                v-else
                color="primary"
                icon="print"
                text-color="white"
              >
                {{ props.row.invoice?.invoice_number }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-opening_balance="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.row.opening_balance)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-debit="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.value > 0 ? props.value : 0)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-credit="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.value < 0 ? props.value * -1 : 0)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-ending_balance="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.row.opening_balance + props.value)
              }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

