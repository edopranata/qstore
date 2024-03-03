<script setup>
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import {useTradingRecapReportStore} from "stores/report/trading/TradingRecapReportStore";

const {can} = useAuthStore()
const {path} = useRoute()
const report = useTradingRecapReportStore()
const {table, form} = useTradingRecapReportStore()
const {getReportOptions: options, getTypeChange, errors} = storeToRefs(useTradingRecapReportStore())

watch(getTypeChange, (optType) => {
  if (optType) {
    report.onReset()
  }
})


onMounted(async () => {
  table.data = []
  form.type = 'Monthly'
  report.onReset()
})

const onSubmit = async () => {
  table.data = []
  await report.getReportData(path)
}

</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-form
      class="tw-w-full"
      @submit="onSubmit"
    >
      <q-card bordered>
        <q-card-section class="tw-space-y-4">
          <q-tabs
            v-model="form.type"
            active-color="primary"
            align="justify"
            class="text-grey"
            indicator-color="primary"
          >
            <q-tab v-for="(item, i) in options" :key="i" :label="item.label" :name="item.value"/>
          </q-tabs>
          <q-separator/>
          <q-tab-panels v-model="form.type" animated class="shadow-2 rounded-borders">
            <q-tab-panel name="Monthly">
              <q-card flat>
                <q-card-section class="no-padding tw-mb-4">
                  <div class="text-h6">Laporan Bulanan Rekapitulasi Pendapatan DO</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex tw-flex-col md:tw-grid md:tw-grid-cols-2">
                    <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                      <q-input
                        v-model="form.monthly"
                        :error="errors.hasOwnProperty('monthly')"
                        :error-message="errors.monthly"
                        :loading="table.loading"
                        filled
                        hint="Contoh: 2024/01"
                        label="Periode bulan"
                        mask="####/##"
                        @change="report.unsetError('monthly')"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions class="no-padding tw-mt-4">
                  <div class="md:tw-col-span-4 tw-col-span-2 tw-space-x-2">
                    <q-btn v-if="can('app.jualBeliSawit.laporan.rekapituliasiJualBeliSawit')" :disable="table.loading"
                           :loading="table.loading" color="primary"
                           glossy
                           label="Lihat laporan"
                           type="submit"/>
                    <q-btn v-if="can('app.jualBeliSawit.laporan.printRekapituliasiJualBeliSawit')"
                           :disable="table.loading || !form.type || String(form.monthly).length !== 7"
                           :loading="table.loading"
                           :to="{name: 'app.jualBeliSawit.laporan.printRekapituliasiJualBeliSawit', query: {type: form.type, monthly: form.monthly}}"
                           color="deep-orange"
                           glossy icon="print" label="Print laporan"/>
                  </div>
                </q-card-actions>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="Annual">
              <q-card flat>
                <q-card-section class="no-padding tw-mb-4">
                  <div class="text-h6">Laporan Tahunan Rekapitulasi Pendapatan DO</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex tw-flex-col md:tw-grid md:tw-grid-cols-2">
                    <div class="tw-grid tw-grid-cols-2 tw-gap-4">
                      <q-input
                        v-model="form.annual"
                        :error="errors.hasOwnProperty('annual')"
                        :error-message="errors.annual"
                        :loading="table.loading"
                        filled
                        hint="Contoh: 2024"
                        label="Periode tahun"
                        mask="####"
                        @change="report.unsetError('annual')"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions class="no-padding tw-mt-4">
                  <div class="md:tw-col-span-4 tw-col-span-2 tw-space-x-2">
                    <q-btn v-if="can('app.jualBeliSawit.laporan.rekapituliasiJualBeliSawit')" :disable="table.loading"
                           :loading="table.loading" color="primary"
                           glossy
                           label="Lihat laporan"
                           type="submit"/>
                    <q-btn v-if="can('app.jualBeliSawit.laporan.printRekapituliasiJualBeliSawit')"
                           :disable="table.loading || !form.type || !form.annual || String(form.annual).length !== 4"
                           :loading="table.loading"
                           :to="{name: 'app.jualBeliSawit.laporan.printRekapituliasiJualBeliSawit', query: {type: form.type, annual: form.annual}}"
                           color="deep-orange"
                           glossy icon="print" label="Print laporan"/>
                  </div>
                </q-card-actions>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-section>
          <q-markup-table dense>
            <thead>
            <tr>
              <th class="text-left">No</th>
              <th class="text-left">Tanggal Transaksi</th>
              <th class="text-left">Jumlah Transaksi</th>
              <th class="text-right">Timbangan Lap (kg)</th>
              <th class="text-right">Harga Lap (Avg) (Rp/kg)</th>
              <th class="text-right">Hasil Petani (Rp)</th>
              <th class="text-right">Timbangan Pabrik (kg)</th>
              <th class="text-right">Harga DO (Avg) (Rp)</th>
              <th class="text-right">Margin (Avg) (Rp)</th>
              <th class="text-right">Biaya (Rp)</th>
              <th class="text-right">Bruto (Rp)</th>
              <th class="text-right">Pendapatan (Rp)</th>
            </tr>
            </thead>
            <tbody v-if="table.data.length > 0">
            <tr v-for="( detail, i) in table.data" :key="i">
              <td>{{ i + 1 }}</td>
              <td>{{ detail.period }}</td>
              <td>{{ detail.count }} Transaksi</td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'unit',
                    unit: 'kilogram'
                  }).format(detail.customer_weight)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.customer_average)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.customer_total)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'unit',
                    unit: 'kilogram'
                  }).format(detail.net_weight)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.net_price)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.margin)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.cost_total)
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 2
                  }).format(detail.gross_total)
                }}
              </td>
              <td class="text-right">
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
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

