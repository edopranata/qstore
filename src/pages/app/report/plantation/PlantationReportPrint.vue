<script setup>
import {usePlantationPrintStore} from "stores/report/plantation/plantationPrintReport";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = usePlantationPrintStore()
const {form, table} = usePlantationPrintStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(usePlantationPrintStore())
const {path, query} = useRoute()
const $q = useQuasar()
onMounted(async () => {
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
    <q-toolbar class="text-primary">
      <q-space></q-space>
      <q-btn dense flat icon="print" round @click="onPrint"/>
    </q-toolbar>
    <div class="tw-grid tw-grid-cols-10 tw-font-sans tw-font-bold">
      <div class="tw-col-span-10">
        <span>Laporan pendapatan kebun periode </span>
        <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `${refForm.monthly}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'period'">{{ `${refForm.period_start} - ${refForm.period_end}` }}</span>
      </div>
    </div>
    <div class="tw-grid tw-grid-cols-10 tw-font-sans" style="font-size: 10px;">
      <span class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-row-span-2 tw-col-span-2 tw-flex tw-items-center">Tanggal</span>
      <span class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-row-span-2 tw-flex tw-items-center justify-end">Tonase</span>
      <span class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-row-span-2 tw-flex tw-items-center justify-end">Harga</span>
      <span class="tw-font-bold tw-text-center tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-t tw-col-span-4">Biaya</span>
      <span class="tw-font-bold tw-text-center tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-t tw-col-span-2">Total</span>


      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Uang Jalan</span>
      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Amprah Mobil</span>
      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Upah Supir</span>
      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Total Biaya</span>
      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Kotor</span>
      <span class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y">Bersih</span>
    </div>
    <template v-if="table.data.length > 0">
      <div class="tw-grid tw-grid-cols-10 tw-font-mono" v-for="(plantation, i) in table.data" :key="i" style="font-size: 10px;">
        <span class="tw-px-2 tw-border-gray-800 tw-border-l tw-col-span-2">{{ plantation.trade_date }}</span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                        {{ new Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(plantation.net_weight) }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_price) }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.trade_cost) }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(parseInt(plantation.car_fee) * parseInt(plantation.net_weight))
              }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(parseInt(plantation.driver_fee) * parseInt(plantation.net_weight))
              }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(plantation.trade_cost + (parseInt(plantation.driver_fee) * parseInt(plantation.net_weight)) + (parseInt(plantation.car_fee) * parseInt(plantation.net_weight)))
          }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-l">
                    {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_total) }}
        </span>
        <span class="tw-px-2 text-right tw-border-gray-800 tw-border-x">
                    {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_income) }}
        </span>
      </div>
    </template>
    <div class="tw-grid tw-grid-cols-10 tw-border-gray-800 tw-font-bold tw-font-mono" style="font-size: 10px;">
      <span class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-text-right tw-col-span-2">Total</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(parseFloat(summaries.tonase)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.price)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.trade_cost)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.car_fee)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.driver_fee)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.cost)) }}</span>
      <span class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.bruto)) }}</span>
      <span class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y tw-text-right">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(parseFloat(summaries.netto)) }}</span>
    </div>
  </q-page>
</template>

