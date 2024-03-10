<script setup>
import {useDriverLoanRecapReportStore} from "stores/report/car/driverLoanRecapReport";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = useDriverLoanRecapReportStore()
const {form, table} = useDriverLoanRecapReportStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(useDriverLoanRecapReportStore())
const {path, query} = useRoute()
const $q = useQuasar()

onMounted(async () => {
  table.data = []
  for (let property in query) {
    form[property] = query[property]
  }

  await print.getReportData(path)

  await setTimeout(async () => {
    onPrint()
  }, 100)
})

const onPrint = () => {
  page.leftDrawer = false
  page.rightDrawer = false
  $q.dialog({
    title: 'Print Laporan',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    setTimeout(() => {
      window.print()
    }, 600)
  })
}
</script>

<template>
  <q-page class="print:tw-mt-0" padding>
    <q-toolbar class="text-primary print-hide">
      <q-space></q-space>
      <q-btn dense flat icon="print" round @click="onPrint"/>
    </q-toolbar>


    <div class="tw-flex justify-between tw-font-sans tw-font-bold">
      <div>Rekap laporan pinjaman dan angsuran supir</div>
      <div>
        <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `Periode ${refForm.monthly}` }}</span></div>
    </div>
    <table class="tw-border-collapse tw-border tw-border-slate-900 tw-w-full">
      <thead>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">No</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Periode / Tanggal</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Jumlah Trx</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Pinjam (Rp)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Angsuran (Rp)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(detail, i) in table.data" :key="i">
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ parseInt(i) + 1 }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">
          {{ detail.period }}
        </td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">
          {{ detail.count }} transaksi
        </td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(detail.debit)
          }}
        </td>

        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(detail.credit)
          }}
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right" colspan="3">Total</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.debit))
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.credit))
          }}
        </th>
      </tr>
      </tfoot>
    </table>
  </q-page>
</template>

