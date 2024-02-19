<script setup>
import {useLandReportStore} from "stores/report/plantation/landReport";
import {storeToRefs} from "pinia";
import {onMounted, watch} from "vue";
import {date} from "quasar";
import {useRoute} from "vue-router";

const {path} = useRoute()
const report = useLandReportStore()
const {table, form, select} = useLandReportStore()
const {getReportOptions: options, getTypeChange, getSelectedLands, errors} = storeToRefs(useLandReportStore())

watch([getTypeChange, getSelectedLands], (optType, landSel) => {
  if (optType) {
    report.onReset()
  }
  if (landSel) {
    form.land_id = landSel
  } else {
    form.land_id = []
  }
})


onMounted( async () => {
  await report.getLandData(path)
})

const onSubmit = async () => {
  await report.getReportData(path)
}

const searchLand = (val, update) => {
  update(() => {
    if (val === '') {
      select.lands_option = select.lands.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      select.lands_option = select.lands.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
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
                <q-select
                  v-model="select.selected_lands"
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('land_id')"
                  :error-message="errors.land_id"
                  :options="select.lands_option"
                  class="tw-w-full tw-col-span-2"
                  fill-input
                  filled
                  label="Lahan"
                  multiple
                  option-label="name"
                  option-value="id"
                  use-chips
                  use-input
                  @change="report.unsetError('land_id')"
                  @filter="searchLand">
                  <template v-slot:selected-item="scope">
                    <q-chip
                      :tabindex="scope.tabindex"
                      class="q-ma-xs"
                      color="primary"
                      removable
                      text-color="white"
                      @remove="scope.removeAtIndex(scope.index)"
                    >
                      {{ scope.opt.name }}
                    </q-chip>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon name="forest"/>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label caption>
                          <q-icon name="phone"/>
                          {{ scope.opt.area }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No results
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-field
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('period_start')"
                  :error-message="errors.period_start"
                  :loading="table.loading"
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
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('period_end')"
                  :error-message="errors.period_end"
                  :loading="table.loading"
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
                <div class="md:tw-col-span-4 tw-col-span-2 tw-space-x-2">
                  <q-btn :disable="table.loading" :loading="table.loading" color="primary" glossy label="Lihat laporan"
                         type="submit"/>
                  <q-btn :disable="table.loading || !form.type || !form.period_start || !form.period_end"
                         :loading="table.loading"
                         :to="{name: 'app.laporan.dataLaporan.printHasilKebun', query: {type: form.type, period_end: form.period_end, period_start: form.period_start}}"
                         color="deep-orange"
                         glossy icon="print" label="Print laporan"/>
                </div>
              </div>

            </q-tab-panel>

            <q-tab-panel name="Monthly">
              <div class="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 tw-gap-4">
                <div class="text-h6 md:tw-col-span-4 tw-col-span-2">Laporan Bulanan Hasil Kebun</div>
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
              <div class="md:tw-col-span-4 tw-col-span-2 tw-mt-2 tw-space-x-2">
                <q-btn :disable="table.loading" :loading="table.loading" color="primary" glossy label="Lihat laporan"
                       type="submit"/>
                <q-btn :disable="table.loading || !form.type || String(form.monthly).length !== 7"
                       :loading="table.loading"
                       :to="{name: 'app.laporan.dataLaporan.printHasilKebun', query: {type: form.type, monthly: form.monthly}}"
                       color="deep-orange"
                       glossy icon="print" label="Print laporan"/>
              </div>
            </q-tab-panel>

            <q-tab-panel name="Annual">
              <div class="tw-grid md:tw-grid-cols-4 tw-grid-cols-2 tw-gap-4">
                <div class="text-h6 md:tw-col-span-4 tw-col-span-2">Laporan Tahunan Hasil Kebun</div>
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
              <div class="md:tw-col-span-4 tw-col-span-2 tw-mt-2 tw-space-x-2">
                <q-btn :disable="table.loading" :loading="table.loading" color="primary" glossy label="Lihat laporan"
                       type="submit"/>
                <q-btn :disable="table.loading || !form.type || !form.annual || String(form.annual).length !== 4"
                       :loading="table.loading"
                       :to="{name: 'app.laporan.dataLaporan.printHasilKebun', query: {type: form.type, annual: form.annual}}"
                       color="deep-orange"
                       glossy icon="print" label="Print laporan"/>
              </div>
            </q-tab-panel>
          </q-tab-panels>
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

