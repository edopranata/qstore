<script setup>
import {useCarReportPrintStore} from "stores/report/car/carReportPrint";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = useCarReportPrintStore()
const {form, table} = useCarReportPrintStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(useCarReportPrintStore())
const {path, query} = useRoute()
const $q = useQuasar()

onMounted(async () => {
  table.data = []
  for (let property in query) {
    form[property] = query[property]
  }

  await print.getReportPrintData(path)

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
        <div>Rekap laporan pendapatan mobil</div>
        <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `${refForm.monthly}` }}</span>
      </div>
    </div>
    <div class="tw-grid tw-grid-cols-7 tw-font-sans" style="font-size: 10px;">
      <div class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-col-span-2">Mobil</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Tanggal Transaksi</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Harga (Rp/kg)</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Tonase</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Perkebunan</div>
      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y">Jual Beli Sawit</div>
    </div>
    <template v-if="table.data.length > 0">
      <div v-for="(detail, i) in table.data" :key="i" class="tw-grid tw-grid-cols-7 tw-font-mono"
           style="font-size: 10px;">
        <div class="tw-px-2 tw-border-gray-800 tw-border-l tw-col-span-2">
          <div class="text-bold">{{ detail.name }} - {{ detail.no_pol }}</div>
        </div>
        <div class="tw-px-2 text-left tw-border-gray-800 tw-border-l">
          {{ detail.trade_date }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(detail.car_fee)
          }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{ new Intl.NumberFormat('id-ID', {
          style: 'unit',
          unit: 'kilogram'
        }).format(detail.net_weight) }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
          {{ new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(detail.type === 'Plantation' ? detail.car_price : 0) }}
        </div>
        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-x">
          {{ new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(detail.type === 'Trading' ? detail.car_price : 0) }}
        </div>
      </div>
    </template>
    <div class="tw-grid tw-grid-cols-7 tw-border-gray-800 tw-font-bold tw-font-mono" style="font-size: 10px;">
      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-text-right tw-col-span-4">Total</div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">
        {{ new Intl.NumberFormat('id-ID', {
          style: 'unit',
          unit: 'kilogram'
        }).format(parseFloat(summaries.tonase)) }}
      </div>
      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">
        {{
          new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(parseFloat(summaries.plantation))
        }}
      </div>
      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y tw-text-right">
        {{ new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(parseFloat(summaries.trading)) }}
      </div>
    </div>
  </q-page>
</template>

