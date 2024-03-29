<script setup>
import {useDOReportPrintStore} from "stores/report/do/DOReportPrintStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = useDOReportPrintStore()
const {form, table} = useDOReportPrintStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(useDOReportPrintStore())
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
      <div class="tw-col-span-10 tw-flex justify-between tw-space-x-2">
        <div>Rekap laporan pendapatan DO dari Pengepul</div>
        <div>
          <span v-if="refForm.type.toLowerCase() === 'period'">{{
              `periode ${refForm.period_start} - ${refForm.period_end}`
            }}</span>
          <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
          <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `${refForm.monthly}` }}</span>
        </div>
      </div>
    </div>
    <table class="tw-border-collapse tw-border tw-border-slate-900 tw-w-full">
      <thead>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Tanggal</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Sumber DO</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Harga Pabrik (Rp/kg)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Tonase</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Margin</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Bruto</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Pendapatan</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(detail, i) in table.data" :key="i">
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ detail.date }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">
          <span v-if="detail.type === 'Customer'" class="text-bold">Pengepul</span>
          <span v-if="detail.type === 'Trading'" class="text-bold">Jual Beli Sawit</span>
          <span v-if="detail.type === 'Plantation'" class="text-bold">Hasil Kebun</span>

          <span v-if="detail.type === 'Customer'" class="text-bold"> - </span>
          <span v-if="detail.type === 'Customer'" class="">{{ detail.customer }}</span>
        </td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.net_price)
          }}
        </td>

        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'unit',
              unit: 'kilogram'
            }).format(detail.net_weight)
          }}
        </td>

        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.margin)
          }}
        </td>

        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.gross_total)
          }}
        </td>

        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.net_total)
          }}
        </td>
      </tr>
      </tbody>
      <tfoot>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right" colspan="2">Total</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.net_price))
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'unit',
              unit: 'kilogram',
              maximumFractionDigits: 0
            }).format(parseFloat(summaries.net_weight))
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.margin))
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.gross_total))
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(parseFloat(summaries.net_total))
          }}
        </th>
      </tr>
      </tfoot>
    </table>
    <!--    <div class="tw-grid tw-grid-cols-7 tw-font-sans" style="font-size: 10px;">-->
    <!--      <div class="tw-font-bold tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Tanggal-->
    <!--        Transaksi-->
    <!--      </div>-->
    <!--      <div class="tw-font-bold tw-text-left tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Sumber DO</div>-->
    <!--      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Harga Pabrik-->
    <!--        (Rp/kg)-->
    <!--      </div>-->
    <!--      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Tonase</div>-->
    <!--      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Margin</div>-->
    <!--      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y">Bruto</div>-->
    <!--      <div class="tw-font-bold tw-text-right tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y">Pendapatan-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <template v-if="table.data.length > 0">-->
    <!--      <div v-for="(detail, i) in table.data" :key="i" class="tw-grid tw-grid-cols-7 tw-font-mono"-->
    <!--           style="font-size: 10px;">-->
    <!--        <div class="tw-px-2 tw-border-gray-800 tw-border-l">-->
    <!--          <div class="text-bold">{{ detail.date }}</div>-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-left tw-border-gray-800 tw-border-l">-->
    <!--          <span v-if="detail.type === 'Customer'" class="text-bold">Pengepul</span>-->
    <!--          <span v-if="detail.type === 'Trading'" class="text-bold">Jual Beli Sawit</span>-->
    <!--          <span v-if="detail.type === 'Plantation'" class="text-bold">Hasil Kebun</span>-->

    <!--          <span v-if="detail.type === 'Customer'" class="text-bold"> - </span>-->
    <!--          <span v-if="detail.type === 'Customer'" class="">{{ detail.customer }}</span>-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">-->
    <!--          {{-->
    <!--            new Intl.NumberFormat('id-ID', {-->
    <!--              style: 'currency',-->
    <!--              currency: 'IDR',-->
    <!--              maximumFractionDigits: 2-->
    <!--            }).format(detail.net_price)-->
    <!--          }}-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">-->
    <!--          {{-->
    <!--            new Intl.NumberFormat('id-ID', {-->
    <!--              style: 'unit',-->
    <!--              unit: 'kilogram'-->
    <!--            }).format(detail.net_weight)-->
    <!--          }}-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">-->
    <!--          {{-->
    <!--            new Intl.NumberFormat('id-ID', {-->
    <!--              style: 'currency',-->
    <!--              currency: 'IDR',-->
    <!--              maximumFractionDigits: 2-->
    <!--            }).format(detail.margin)-->
    <!--          }}-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-l">-->
    <!--          {{-->
    <!--            new Intl.NumberFormat('id-ID', {-->
    <!--              style: 'currency',-->
    <!--              currency: 'IDR',-->
    <!--              maximumFractionDigits: 2-->
    <!--            }).format(detail.gross_total)-->
    <!--          }}-->
    <!--        </div>-->
    <!--        <div class="tw-px-2 text-right tw-border-gray-800 tw-border-x">-->
    <!--          {{-->
    <!--            new Intl.NumberFormat('id-ID', {-->
    <!--              style: 'currency',-->
    <!--              currency: 'IDR',-->
    <!--              maximumFractionDigits: 2-->
    <!--            }).format(detail.net_total)-->
    <!--          }}-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </template>-->
    <!--    <div class="tw-grid tw-grid-cols-7 tw-border-gray-800 tw-font-bold tw-font-mono" style="font-size: 10px;">-->
    <!--      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-l tw-border-y tw-text-right tw-col-span-2">Total</div>-->
    <!--      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">-->
    <!--            {{-->
    <!--              new Intl.NumberFormat('id-ID', {-->
    <!--                style: 'currency',-->
    <!--                currency: 'IDR',-->
    <!--                maximumFractionDigits: 2-->
    <!--              }).format(parseFloat(summaries.net_price))-->
    <!--            }}-->
    <!--      </div>-->
    <!--      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">-->
    <!--            {{-->
    <!--              new Intl.NumberFormat('id-ID', {-->
    <!--                style: 'unit',-->
    <!--                unit: 'kilogram',-->
    <!--                maximumFractionDigits: 0-->
    <!--              }).format(parseFloat(summaries.net_weight))-->
    <!--            }}-->
    <!--      </div>-->
    <!--      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">-->
    <!--            {{-->
    <!--              new Intl.NumberFormat('id-ID', {-->
    <!--                style: 'currency',-->
    <!--                currency: 'IDR',-->
    <!--                maximumFractionDigits: 2-->
    <!--              }).format(parseFloat(summaries.margin))-->
    <!--            }}-->
    <!--      </div>-->
    <!--      <div class="tw-px-2 tw-py-1 text-right tw-border-gray-800 tw-border-l tw-border-y">-->
    <!--            {{-->
    <!--              new Intl.NumberFormat('id-ID', {-->
    <!--                style: 'currency',-->
    <!--                currency: 'IDR',-->
    <!--                maximumFractionDigits: 2-->
    <!--              }).format(parseFloat(summaries.gross_total))-->
    <!--            }}-->
    <!--      </div>-->
    <!--      <div class="tw-px-2 tw-py-1 tw-border-gray-800 tw-border-x tw-border-y tw-text-right">-->
    <!--            {{-->
    <!--              new Intl.NumberFormat('id-ID', {-->
    <!--                style: 'currency',-->
    <!--                currency: 'IDR',-->
    <!--                maximumFractionDigits: 2-->
    <!--              }).format(parseFloat(summaries.net_total))-->
    <!--            }}-->
    <!--      </div>-->
    <!--    </div>-->
  </q-page>
</template>

