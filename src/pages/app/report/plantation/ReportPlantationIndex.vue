<script setup>
import {usePlantationReportStore} from "stores/report/plantationReport";
import {storeToRefs} from "pinia";
import {watch} from "vue";
import {date} from "quasar";
import {useRoute} from "vue-router";

const {path} = useRoute()
const report = usePlantationReportStore()
const {table, form} = usePlantationReportStore()
const {getReportOptions: options, getTypeChange, errors} = storeToRefs(usePlantationReportStore())

watch(getTypeChange, (optType) => {
  if (optType) {
    report.onReset()
  }
})

const onSubmit = async () => {
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
            <q-tab-panel name="Period">
              <div class="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 tw-gap-4">
                <div class="text-h6 md:tw-col-span-4 tw-col-span-2">Periode Laporan Hasil Kebun</div>
                <q-field
                  :loading="table.loading"
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('period_start')"
                  :error-message="errors.period_start"
                  :stack-label="!!form.period_start"
                  class="tw-w-full"

                  filled
                  label="Tanggal Awal">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ date.formatDate(form.period_start, 'DD MMMM YYYY') }}
                    </div>
                  </template>
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event" tabindex="0">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="form.period_start" :on-update:model-value="report.unsetError('period_start')">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close"/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-field>
                <q-field
                  :loading="table.loading"
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('period_end')"
                  :error-message="errors.period_end"
                  :stack-label="!!form.period_end"
                  class="tw-w-full"
                  filled
                  label="Tanggal Akhir">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="0">
                      {{ date.formatDate(form.period_end, 'DD MMMM YYYY') }}
                    </div>
                  </template>
                  <template v-slot:append>
                    <q-icon class="cursor-pointer" name="event" tabindex="0">
                      <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                        <q-date v-model="form.period_end" :on-update:model-value="report.unsetError('period_end')">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup color="primary" flat label="Close"/>
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-field>
              </div>

            </q-tab-panel>

            <q-tab-panel name="Monthly">
              <div class="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 tw-gap-4">
                <div class="text-h6 md:tw-col-span-4 tw-col-span-2">Laporan Bulanan Hasil Kebun</div>
                <q-input
                  :loading="table.loading"
                  v-model="form.monthly"
                  :error="errors.hasOwnProperty('monthly')"
                  :error-message="errors.monthly"
                  filled
                  hint="Contoh: 2024/01"
                  label="Periode bulan"
                  mask="####/##"
                  @change="report.unsetError('monthly')"
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="Annual">
              <div class="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 tw-gap-4">
                <div class="text-h6 md:tw-col-span-4 tw-col-span-2">Laporan Tahunan Hasil Kebun</div>
                <q-input
                  :loading="table.loading"
                  v-model="form.annual"
                  :error="errors.hasOwnProperty('annual')"
                  :error-message="errors.annual"
                  filled
                  hint="Contoh: 2024"
                  label="Periode tahun"
                  mask="####"
                  @change="report.unsetError('annual')"
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
          <q-btn color="deep-orange" :disable="table.loading" :loading="table.loading" glossy label="Lihat laporan" type="submit"/>
        </q-card-section>
        <q-card-section>
          <q-markup-table>
            <thead>
            <tr>
              <th class="text-left" rowspan="2">Tanggal</th>
              <th class="text-right" rowspan="2">Tonase (kg)</th>
              <th class="text-right" rowspan="2">Harga (Rp/kg)</th>
              <th colspan="4">Biaya</th>
              <th colspan="2">Pendapatan</th>
            </tr>
            <tr>
              <th class="text-right">Uang Jalan</th>
              <th class="text-right">Amprah Mobil</th>
              <th class="text-right">Upah Supir</th>
              <th class="text-right">Total Biaya</th>
              <th class="text-right">Kotor</th>
              <th class="text-right">Bersih</th>
            </tr>
            </thead>
            <tbody v-if="table.data.length > 0">
            <tr v-for="(plantation, i) in table.data" :key="i">
              <td>{{ plantation.trade_date }}</td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_weight) }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_price) }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.trade_cost) }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(parseInt(plantation.car_fee) * parseInt(plantation.net_weight))
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(parseInt(plantation.driver_fee) * parseInt(plantation.net_weight))
                }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(plantation.trade_cost + (parseInt(plantation.driver_fee) * parseInt(plantation.net_weight)) + (parseInt(plantation.car_fee) * parseInt(plantation.net_weight)))
                }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_total) }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(plantation.net_income) }}
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

