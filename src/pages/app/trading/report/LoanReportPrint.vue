<script setup>
import {useDriverLoanReportStore} from "stores/report/car/driverLoanReport";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {date, useQuasar} from "quasar";

const $q = useQuasar()
const page = usePageStore()
const {can} = useAuthStore()
const {path} = useRoute()
const report = useDriverLoanReportStore()
const {table} = useDriverLoanReportStore()
const {errors, getSummaries: summaries,} = storeToRefs(useDriverLoanReportStore())

onMounted(async () => {
  table.data = []
  await report.getReportData(path)
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
    <div class="tw-grid tw-grid-cols-10 tw-font-sans tw-font-bold">
      <div class="tw-col-span-10 tw-flex justify-between tw-space-x-2">
        <div>Laporan Sisa pinjaman petani</div>
        <span>{{ date.formatDate( Date.now(), 'DD-MM-YYYY') }}</span>
      </div>
    </div>
    <table class="tw-border-collapse tw-border tw-border-slate-900 tw-w-full tw-text-xs tw-font-sans">
      <thead>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left" style="width: 60px">No</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Nama Petani</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">No Telp</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Jumlah Pinjaman</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(detail, i) in table.data" :key="i">
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ i + 1 }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ detail.name }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ detail.phone }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.balance)
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
            }).format(summaries.balance)
          }}
        </th>
      </tr>
      </tfoot>
    </table>
  </q-page>
</template>

