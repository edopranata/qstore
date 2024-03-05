<script setup>
import {useTradingRecapReportPrintStore} from "stores/report/trading/TradingRecapReportPrintStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted} from "vue";
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const page = usePageStore()
const print = useTradingRecapReportPrintStore()
const {form, table} = useTradingRecapReportPrintStore()
const {getAllData: data, getSummaries: summaries, form: refForm} = storeToRefs(useTradingRecapReportPrintStore())
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
      <div>Rekapitulasi hasil kebun</div>
      <div>
        <span v-if="refForm.type.toLowerCase() === 'annual'">{{ `Tahun ${refForm.annual}` }}</span>
        <span v-if="refForm.type.toLowerCase() === 'monthly'">{{ `Periode ${refForm.monthly}` }}</span></div>
    </div>
    <table class="tw-border-collapse tw-border tw-border-slate-900 tw-w-full tw-text-xs tw-font-sans">
      <thead>
      <tr>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">No</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Tanggal Transaksi</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-left">Jumlah Transaksi</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Timbangan Pabrik (kg)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Harga DO (Avg) (Rp)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Biaya (Rp)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Bruto (Rp)</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">Pendapatan (Rp)</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(detail, i) in table.data" :key="i">
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ i + 1 }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ detail.period }}</td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2">{{ detail.count }} Transaksi</td>
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
            }).format(detail.net_price)
          }}
        </td>
        <td class="tw-border tw-border-slate-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(detail.cost_total)
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
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right" colspan="3">Total</th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'unit',
              unit: 'kilogram'
            }).format(summaries.net_weight)
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(summaries.net_price)
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(summaries.cost_total)
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(summaries.gross_total)
          }}
        </th>
        <th class="tw-border tw-border-gray-900 tw-py-1 tw-px-2 text-right">
          {{
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 2
            }).format(summaries.net_total)
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

