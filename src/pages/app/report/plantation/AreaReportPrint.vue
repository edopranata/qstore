<script setup>
import {useLandPrintStore} from "stores/report/plantation/landPrintReport";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = useLandPrintStore()
const {form, table} = useLandPrintStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(useLandPrintStore())
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
    <div class="tw-grid tw-grid-cols-10 tw-font-sans tw-font-bold">
      <div class="tw-col-span-10 tw-flex justify-start tw-space-x-2">
        <div>Laporan pendapatan rata-rata berdasarkan lahan periode</div>
        <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `${refForm.monthly}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'period'">{{
            `${refForm.period_start} - ${refForm.period_end}`
          }}
        </span>
      </div>
    </div>
    <div class="tw-grid tw-grid-cols-10 tw-font-sans" style="font-size: 10px;">
      <div class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-col-span-2">Lahan</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Tanggal
        Transaksi
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Harga (Rp/kg)
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Luas Lahan
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Total Batang
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Biaya (Rp)
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Kilogram (Ha)
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Bruto (Rp)
      </div>
      <div
        class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y">Netto (Rp)
      </div>
    </div>
    <template v-if="table.data.length > 0">
      <div v-for="(detail, i) in table.data" :key="i" class="tw-grid tw-grid-cols-10 tw-font-mono"
           style="font-size: 10px;">
        <div class="tw-px-2 tw-border-gray-800 tw-border-l tw-col-span-2">
          <div><span class="text-bold">{{ detail.area }}</span> - {{ detail.name }}</div>
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{ detail.trade_date.split(' ')[0] }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.net_price)
          }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{ new Intl.NumberFormat('id-ID').format(detail.wide) }} Ha
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{ new Intl.NumberFormat('id-ID').format(detail.trees) }} Btg
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(detail.avg_cost))
          }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'unit',
              unit: 'kilogram',
              maximumFractionDigits: 2
            }).format(parseFloat(detail.avg_wide_weight))
          }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(detail.bruto))
          }}        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-x">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(detail.netto))
          }}        </div>
      </div>
    </template>
    <div class="tw-grid tw-grid-cols-10 tw-border-gray-800 tw-font-bold tw-font-mono" style="font-size: 10px;">
      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-text-right tw-col-span-4">Total</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID').format(parseFloat(summaries.wide)) }} Ha</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID').format(parseFloat(summaries.trees)) }} Btg</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 2
          }).format(parseFloat(summaries.avg_cost))
        }}</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{
          new Intl.NumberFormat('id-ID', {
            style: 'unit',
            unit: 'kilogram',
            maximumFractionDigits: 2
          }).format(parseFloat(summaries.avg_wide_weight))
        }}</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 2
          }).format(parseFloat(summaries.bruto))
        }}</div>
      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y tw-text-right">{{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 2
          }).format(parseFloat(summaries.netto))
        }}</div>
    </div>
  </q-page>
</template>

