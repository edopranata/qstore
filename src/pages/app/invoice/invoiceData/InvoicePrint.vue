<script setup>
import {useInvoicePrintStore} from "stores/invoice/invoicePrint";
import {usePageStore} from "stores/helper/pageStore";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {date, useQuasar} from 'quasar'
import BlankRowPrint from "components/invoice/BlankRowPrint.vue";
import LoanRowPrint from "components/invoice/LoanRowPrint.vue";
import FooterRowPrint from "components/invoice/FooterRowPrint.vue";

const page = usePageStore()
const print = useInvoicePrintStore()
const {invoice} = useInvoicePrintStore()
const {getInvoiceData: data, getSumDOTransaction: summaries, getSummaries: sub_total} = storeToRefs(useInvoicePrintStore())
const {path} = useRoute()
const $q = useQuasar()

onMounted(async () => {
  await print.getInvoiceDataFromApi(path)
  setTimeout(() => {
    onPrint()
  }, 600)
})

const onPrint = () => {
  page.leftDrawer = false
  page.rightDrawer = false
  $q.dialog({
    title: 'Print invoice',
    message: `Invoice number : ${invoice.data.invoice_number}`,
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
  <q-page class="print:tw-mt-0">
    <div class="tw-flex">
      <q-card v-if="data" class="tw-w-3/6 print:tw-w-full" flat>
        <q-card-section class="print-hide">
          <q-toolbar class="text-primary">
            <q-space></q-space>
            <q-btn dense flat icon="print" round @click="onPrint"/>
          </q-toolbar>
        </q-card-section>
        <q-card-section>
          <div class="tw-flex">
            <q-img alt="logo" class="tw-w-28" fit="fill" src="/img/logo.png"/>
            <div class="tw-flex tw-flex-col text-left tw-mt-4">
              <div class="tw-text-4xl tw-font-bold tw-underline tw-font-sans">MAY-MAY</div>
              <div class="tw-text-xs tw-font-bold">HP: 0813-6500-1163</div>
            </div>
            <q-space></q-space>
            <div class="tw-flex tw-flex-col tw-w-64 tw-mt-6">
              <div class="tw-border-b tw-border-gray-900">Kepada</div>
              <div class="tw-border-b tw-border-gray-900 tw-font-bold">{{ data.customer?.name.toUpperCase() }}</div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="flex justify-between">
            <div class="tw-font-bold">No Nota: {{ data.invoice_number }}</div>
            <div class="tw-font-bold">Tanggal Nota: {{ data.trade_date }}</div>
          </div>
          <div class="tw-grid tw-grid-cols-5">
            <span
              class="tw-font-bold tw-text-center tw-px-4 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-col-span-2">Tanggal / Keterangan</span>
            <span class="tw-font-bold tw-text-center tw-px-4 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Banyaknya</span>
            <span
              class="tw-font-bold tw-text-center tw-px-4 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Harga</span>
            <span
              class="tw-font-bold tw-text-center tw-px-4 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y">Total</span>
          </div>
          <div v-if="data.type !== 'LN'" class="tw-grid tw-grid-cols-5">
            <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-font-bold tw-col-span-2">Transaksi</span>
            <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
            <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
            <span class="tw-px-4 tw-border-gray-800 tw-border-x"></span>
          </div>

          <template v-if="data.detail_do?.length > 0">
            <div v-for="(item, index) in data.detail_do" :key="index" class="tw-grid tw-grid-cols-5">
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">{{
                  date.formatDate(item.delivery_date.split('T')[0], 'DD MMMM YYYY')
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'unit',
                    unit: 'kilogram'
                  }).format(parseFloat(item.customer_weight))
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.customer_price))
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-x tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.customer_total))
                }}</span>
            </div>

            <div v-if="data.type !== 'LN'" class="tw-grid tw-grid-cols-5">
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-x tw-font-bold text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(summaries.total))
                }}</span>
            </div>
          </template>

          <template v-if="data.detail_trades?.length > 0">
            <div v-for="(item, index) in data.detail_trades" :key="index" class="tw-grid tw-grid-cols-5">
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">{{
                  date.formatDate(item.trade_date.split('T')[0], 'DD MMMM YYYY')
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'unit',
                    unit: 'kilogram'
                  }).format(parseFloat(item.weight))
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.price))
                }}</span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-x tw-text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(item.total))
                }}</span>
            </div>

            <div v-if="data.type !== 'LN'" class="tw-grid tw-grid-cols-5">
              <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
              <span class="tw-px-4 tw-border-gray-800 tw-border-x tw-font-bold text-right">{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                  }).format(parseFloat(summaries.total_trading))
                }}</span>
            </div>
          </template>




          <template v-if="data.type !== 'LN'">
            <blank-row-print v-for="item in summaries.count" :key="item"/>
          </template>

          <loan-row-print v-if="data.loan" :loan="data.loan"/>

          <template v-if="data.type === 'LN'">
            <blank-row-print v-for="item in summaries.count" :key="item"/>
          </template>

          <div class="tw-grid tw-grid-cols-5 tw-border-gray-800 tw-border-b-2 tw-font-bold">
            <span class="tw-px-4 tw-py-1 tw-border-gray-800 tw-border-l tw-border-t tw-text-right tw-col-span-4">Total Diterima</span>
            <span class="tw-px-4 tw-py-1 tw-border-gray-800 tw-border-x tw-border-t tw-text-right">{{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(parseFloat(sub_total ?? 0))
              }}</span>
          </div>

        </q-card-section>
        <q-card-section>
          <footer-row-print/>
        </q-card-section>

      </q-card>
    </div>

  </q-page>
</template>

