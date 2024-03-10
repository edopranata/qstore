<script setup>
import {useInvoiceDataStore} from "stores/invoice/invoiceData";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useQuasar} from "quasar";

const $q = useQuasar()
const router = useRouter()
const page = usePageStore()
const invoice = useInvoiceDataStore()
const {table} = useInvoiceDataStore()
const {path} = useRoute()

const tableRef = ref()

onMounted(async () => {
  tableRef.value.requestServerInteraction()
})

const toPrint = async (invoice) => {
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
const onRequest = async (props) => {
  await invoice.getInvoiceData(path, props)
}

</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-card bordered>
      <q-card-section class="tw-p-0">
        <q-table
          flat
          ref="tableRef"
          :columns="table.headers ?? []"
          :dense="$q.screen.lt.md"
          :grid="$q.screen.lt.md"
          :loading="table.loading"
          :rows="table.data ?? []"
          bordered
          row-key="id"
          @request="onRequest"
        >
          <template v-slot:top>
            <q-toolbar class="text-primary">
              <q-toolbar-title>
                Daftar Invoice
              </q-toolbar-title>
            </q-toolbar>
          </template>

          <template v-slot:body-cell-no="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-invoice_number="props">
            <q-td :props="props">
              <q-chip
                clickable
                color="primary"
                icon="print"
                text-color="white"
                @click="toPrint(props.value)">
                {{ props.value }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-detail_trades="props">
            <q-td :props="props">
              <div>
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(props.row.detail_trades.length > 0 ? props.row.detail_trades.reduce((total, item) => parseFloat(total) + parseFloat(item.total), 0) : 0)) }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-detail_do="props">
            <q-td :props="props">
              <div>
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(props.row.detail_do.length > 0 ? props.row.detail_do.reduce((total, item) => parseFloat(total) + parseFloat(item.customer_total), 0) : 0)) }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-loan_detail="props">
            <q-td :props="props">
              <div>{{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    'currency': 'IDR'
                  }).format(parseFloat(props.value ? props.value.debit ? props.value.debit : props.value.credit : 0))
                }}
              </div>
              <div class="text-caption">{{ props.value ? props.value.debit ? 'Pinjaman' : 'Angsuran' : '' }}</div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

