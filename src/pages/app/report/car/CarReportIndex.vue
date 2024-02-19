<script setup>
import {useCarReportStore} from "stores/report/car/carReport";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted, watch} from "vue";
import {date} from "quasar";
import {useRoute} from "vue-router";

const {can} = useAuthStore()
const {path} = useRoute()
const report = useCarReportStore()
const {table, form, select} = useCarReportStore()
const {getReportOptions: options, getTypeChange, getSelectedCars, errors} = storeToRefs(useCarReportStore())

watch([getSelectedCars], ([carSel]) => {
  if (carSel) {
    form.car_id = carSel
    delete report.errors.car_id
  } else {
    form.car_id = []
  }
})

watch(getTypeChange, (optType) => {
  if (optType) {
    report.onReset()
  }
})


onMounted(async () => {
  table.data = []
  form.type = 'Period'
  report.onReset()
  await report.getCarData(path)
})

const onSubmit = async () => {
  await report.getReportData(path)
}

const searchCar = (val, update) => {
  update(() => {
    if (val === '') {
      select.cars_option = select.cars.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      select.cars_option = select.cars.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
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
              <q-card flat>
                <q-card-section class="no-padding tw-mb-4">
                  <div class="text-h6">Periode Laporan Pendapatan Mobil</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex md:tw-grid md:tw-grid-cols-2">
                    <q-select
                      v-model="select.selected_cars"
                      :dense="$q.screen.lt.md"
                      :error="errors.hasOwnProperty('car_id')"
                      :error-message="errors.car_id"
                      :options="select.cars_option"
                      class="tw-w-full"
                      fill-input
                      filled
                      label="Mobil"
                      multiple
                      option-label="no_pol"
                      option-value="id"
                      use-chips
                      use-input
                      @change="report.unsetError('car_id')"
                      @filter="searchCar">
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
                            <q-icon name="local_shipping"/>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.name }}</q-item-label>
                            <q-item-label caption>
                              <q-icon name="phone"/>
                              {{ scope.opt.no_pol }}
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
                  </div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex tw-flex-col md:tw-grid md:tw-grid-cols-2">
                    <div class="tw-grid tw-grid-cols-2 tw-gap-4">
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
                              <q-date v-model="form.period_start"
                                      :on-update:model-value="report.unsetError('period_start')">
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
                              <q-date v-model="form.period_end"
                                      :on-update:model-value="report.unsetError('period_end')">
                                <div class="row items-center justify-end">
                                  <q-btn v-close-popup color="primary" flat label="Close"/>
                                </div>
                              </q-date>
                            </q-popup-proxy>
                          </q-icon>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions class="no-padding tw-mt-4">
                  <div class="md:tw-col-span-4 tw-col-span-2 tw-space-x-2">
                    <q-btn v-if="can('app.laporan.dataLaporan.penghasilanMobil')" :disable="table.loading" :loading="table.loading" color="primary"
                           glossy

                           label="Lihat laporan"
                           type="submit"/>
                    <q-btn
                      v-if="can('app.laporan.dataLaporan.printPenghasilanMobil')"
                      :disable="table.loading || !form.type || !form.period_start || !form.period_end || !form.car_id.length"
                      :loading="table.loading"
                      :to="{name: 'app.laporan.dataLaporan.printPenghasilanMobil', query: {type: form.type, period_end: form.period_end, period_start: form.period_start, car_id: select.selected_cars.map(e => e.id) }}"
                      color="deep-orange"
                      glossy icon="print" label="Print laporan"/>
                  </div>
                </q-card-actions>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="Monthly">
              <q-card flat>
                <q-card-section class="no-padding tw-mb-4">
                  <div class="text-h6">Laporan Bulanan Pendapatan Mobil</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex md:tw-grid md:tw-grid-cols-2">
                    <q-select
                      v-model="select.selected_cars"
                      :dense="$q.screen.lt.md"
                      :error="errors.hasOwnProperty('car_id')"
                      :error-message="errors.car_id"
                      :options="select.cars_option"
                      class="tw-w-full"
                      fill-input
                      filled
                      label="Mobil"
                      multiple
                      option-label="no_pol"
                      option-value="id"
                      use-chips
                      use-input
                      @change="report.unsetError('car_id')"
                      @filter="searchCar">
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
                            <q-icon name="local_shipping"/>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.name }}</q-item-label>
                            <q-item-label caption>
                              <q-icon name="phone"/>
                              {{ scope.opt.no_pol }}
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
                  </div>
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
                    <q-btn v-if="can('app.laporan.dataLaporan.penghasilanMobil')" :disable="table.loading" :loading="table.loading" color="primary"
                           glossy
                           label="Lihat laporan"
                           type="submit"/>
                    <q-btn v-if="can('app.laporan.dataLaporan.printPenghasilanMobil')"
                           :disable="table.loading || !form.type || String(form.monthly).length !== 7"
                           :loading="table.loading"
                           :to="{name: 'app.laporan.dataLaporan.printPenghasilanMobil', query: {type: form.type, monthly: form.monthly, car_id: select.selected_cars.map(e => e.id)}}"
                           color="deep-orange"
                           glossy icon="print" label="Print laporan"/>
                  </div>
                </q-card-actions>
              </q-card>
            </q-tab-panel>
            <q-tab-panel name="Annual">
              <q-card flat>
                <q-card-section class="no-padding tw-mb-4">
                  <div class="text-h6">Laporan Tahunan Pendapatan Mobil</div>
                </q-card-section>
                <q-card-section class="no-padding">
                  <div class="tw-flex md:tw-grid md:tw-grid-cols-2">
                    <q-select
                      v-model="select.selected_cars"
                      :dense="$q.screen.lt.md"
                      :error="errors.hasOwnProperty('car_id')"
                      :error-message="errors.car_id"
                      :options="select.cars_option"
                      class="tw-w-full"
                      fill-input
                      filled
                      label="Mobil"
                      multiple
                      option-label="no_pol"
                      option-value="id"
                      use-chips
                      use-input
                      @change="report.unsetError('car_id')"
                      @filter="searchCar">
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
                            <q-icon name="local_shipping"/>
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ scope.opt.name }}</q-item-label>
                            <q-item-label caption>
                              <q-icon name="phone"/>
                              {{ scope.opt.no_pol }}
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
                  </div>
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
                    <q-btn v-if="can('app.laporan.dataLaporan.penghasilanMobil')" :disable="table.loading" :loading="table.loading" color="primary"
                           glossy
                           label="Lihat laporan"
                           type="submit"/>
                    <q-btn v-if="can('app.laporan.dataLaporan.printPenghasilanMobil')"
                           :disable="table.loading || !form.type || !form.annual || String(form.annual).length !== 4"
                           :loading="table.loading"
                           :to="{name: 'app.laporan.dataLaporan.printPenghasilanMobil', query: {type: form.type, annual: form.annual, car_id: select.selected_cars.map(e => e.id)}}"
                           color="deep-orange"
                           glossy icon="print" label="Print laporan"/>
                  </div>
                </q-card-actions>
              </q-card>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-card-section>
          <q-markup-table>
            <thead>
            <tr>
              <th class="text-left">Mobil</th>
              <th class="text-left">Tanggal Transaksi</th>
              <th class="text-right">Harga (Rp/kg)</th>
              <th class="text-right">Tonase</th>
              <th class="text-right">Perkebunan</th>
              <th class="text-right">Jual Beli Sawit</th>
            </tr>
            </thead>
            <tbody v-if="table.data.length > 0">
            <tr v-for="( detail, i) in table.data" :key="i">
              <td>
                <div class="text-bold">{{ detail.name }}</div>
                <div class="tw-text-xs">{{ detail.no_pol }}</div>
              </td>
              <td class="text-left">
                {{ detail.trade_date }}
              </td>
              <td class="text-right">
                {{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(detail.car_fee)
                }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {
                style: 'unit',
                unit: 'kilogram'
              }).format(detail.net_weight) }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(detail.type === 'Plantation' ? detail.car_price : 0) }}
              </td>
              <td class="text-right">
                {{ new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(detail.type === 'Trading' ? detail.car_price : 0) }}
              </td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

