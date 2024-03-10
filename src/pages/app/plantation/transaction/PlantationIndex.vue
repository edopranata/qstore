<script setup>
import {usePlantationsStore} from "stores/transaction/plantation";
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {date, useQuasar} from "quasar";
import {storeToRefs} from "pinia";

const $q = useQuasar()
const page = usePageStore()
const {path} = useRoute()
const {can} = useAuthStore()
const {table, form, cars, drivers, lands} = usePlantationsStore()
const {
  form: formField,
  areas,
  errors,
  getSelectedCar,
  getSelectedDriver,
  cars_option,
  drivers_option,
  getSelectedLands: selectedLands,
  getParentSelected: selected,
  getLandsOption: lands_option
} = storeToRefs(usePlantationsStore())
const plantation = usePlantationsStore()

const tableRef = ref()

onMounted(async () => {
  plantation.onReset()
  tableRef.value.requestServerInteraction()
})

watch([getSelectedCar, getSelectedDriver, selectedLands, formField], ([carSel, driverSel, landSel, frm]) => {
  if (carSel) {
    if (carSel.hasOwnProperty('id'))
      form.car_id = carSel.id
  } else {
    form.car_id = carSel
  }
  if (driverSel) {
    if (driverSel.hasOwnProperty('id'))
      form.driver_id = driverSel.id
  } else {
    form.driver_id = driverSel
  }
  if (landSel) {
    form.land_id = landSel
  } else {
    form.land_id = []
  }
  if (frm) {
    for (let property in frm) {
      if (frm[property]?.length) {
        plantation.unsetError(property)
      }
      if (property === 'car_id' && form[property]) {
        plantation.unsetError(property)
      }
      if (property === 'driver_id' && form[property]) {
        plantation.unsetError(property)
      }
    }
  }
}, {deep: true})

const onRequest = async (props) => {
  await plantation.getPlantationData(path, props)
}

const searchCar = (val, update) => {
  update(() => {
    if (val === '') {
      plantation.cars_option = plantation.cars.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      plantation.cars_option = plantation.cars.filter(({no_pol}) => no_pol.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}

const searchDriver = (val, update) => {
  update(() => {
    if (val === '') {
      plantation.drivers_option = plantation.drivers.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      plantation.drivers_option = plantation.drivers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}

const searchLand = (val, update) => {
  update(() => {
    if (val === '') {
      plantation.lands_option = plantation.lands.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      plantation.lands_option = plantation.lands.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}
const onReset = () => {
  plantation.onReset()
}
const onSubmit = () => {
  $q.dialog({
    title: form.id ? 'Update data' : 'Simpan data',
    message: 'Apakah data yang di input sudah benar?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    plantation.submitForm(path)
  })
}

const onDelete = () => {
  $q.dialog({
    title: 'Hapus data',
    message: '<div class="text-red">Apakah anda yakin akan menghapus data ini?</div>',
    html: true,

    cancel: true,
    persistent: true
  }).onOk(() => {
    plantation.submitDelete(path)
  })
}

const onUpdate = () => {
  $q.dialog({
    title: 'Ubah Data',
    message: '<div class="text-warning">Apakah anda yakin akan mengubah data ini?</div>',
    html: true,

    cancel: true,
    persistent: true
  }).onOk(() => {
    const sel = table.selected.length === 1 ? table.selected[0] : []
    plantation.selected_lands = []

    for (let property in form) {
      form[property] = sel[property]
      if(property === 'loader_land_fee') {

        form[property] = sel['loader_fee']
      }
      if (property === 'land_id') {
        let temp = {}
        plantation.areas.forEach(area => {
          area?.lands.forEach(land => {
            temp = land
            temp.area = area.name
            if (sel.details?.filter(det => det.land_id === land.id).length > 0) {
              plantation.selected_lands.push(temp)
            }
          })
        })
      }

    }


    if (form.car_id) {
      let c = plantation.cars.filter(cus => cus.id === form.car_id)
      plantation.selected_car = c[0]
    }
    if (form.driver_id) {
      let d = plantation.drivers.filter(drive => drive.id === form.driver_id)
      plantation.selected_driver = d[0]
    }
    if (form.trade_date) {
      form.trade_date = form.trade_date.split(' ')[0]
    }
  })
}
</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-card v-if="can('app.perkebunan.hasilKebun.[createHasilKebun]')" bordered>
      <q-form
        class="tw-w-full"
        @reset="onReset"
        @submit="onSubmit"
      >
        <q-card-section>
          <div class="tw-flex tw-flex-col md:tw-grid md:tw-gap-4 md:tw-grid-cols-2">
            <div class="tw-grid tw-gap-2 tw-grid-cols-2 tw-content-start">
              <div class="tw-font-bold tw-col-span-2">Data kebun dan timbangan pabrik</div>
              <q-field
                class="tw-col-span-2"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('trade_date')"
                :error-message="errors.trade_date"
                :stack-label="!!form.trade_date"
                filled
                label="Tanggal Panen">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ date.formatDate(form.trade_date, 'DD MMMM YYYY') }}
                  </div>
                </template>
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="calendar_month" tabindex="0">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                      <q-date v-model="form.trade_date" @focusout="plantation.unsetError('trade_date')">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-field>
              <q-number
                v-model="form.net_weight"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('net_weight')"
                :error-message="errors.net_weight"
                :options="page.unitFormat"

                class="tw-w-full"
                filled
                label="Berat Bersih (kg)"
              />
              <q-number
                v-model="form.net_price"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('net_price')"
                :error-message="errors.net_price"
                :options="page.currencyFormat"

                class="tw-w-full"
                filled
                label="Harga DO (Rp)"
              />
              <q-select
                v-model="plantation.selected_car"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('car_id')"
                :error-message="errors.car_id"
                :options="cars_option"
                class="tw-w-full"
                clearable
                fill-input
                filled
                hide-selected
                label="Mobil"
                option-label="no_pol"
                option-value="id"
                use-input
                @change="plantation.unsetError('car_id')"
                @filter="searchCar">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="local_shipping"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption>
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

              <q-select
                v-model="plantation.selected_driver"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('driver_id')"
                :error-message="errors.driver_id"
                :options="drivers_option"
                class="tw-w-full"
                clearable
                fill-input
                filled
                hide-selected
                label="Supir"
                option-label="name"
                option-value="id"
                use-input
                @change="plantation.unsetError('driver_id')"
                @filter="searchDriver">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="airline_seat_recline_extra"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                      <q-item-label caption>
                        <q-icon name="phone"/>
                        {{ scope.opt.phone }}
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

              <q-select
                v-model="plantation.selected_lands"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('land_id')"
                :error-message="errors.land_id"
                :options="lands_option"
                class="tw-w-full tw-col-span-2"
                fill-input
                filled
                label="Lahan"
                multiple
                option-label="name"
                option-value="id"
                use-chips
                use-input
                @change="plantation.unsetError('land_id')"
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
            </div>
            <div class="tw-grid tw-gap-2 tw-grid-cols-2 tw-content-start">
              <div class="tw-font-bold tw-col-span-2">Uang jalan dan biaya</div>
              <q-number
                v-model="form.trade_cost"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('trade_cost')"
                :error-message="errors.trade_cost"
                :options="page.currencyFormat"

                class="tw-w-full"
                filled
                label="Uang Jalan (Rp)"
              />
              <q-number
                v-model="form.car_transport"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('car_transport')"
                :error-message="errors.car_transport"
                :options="page.currencyFormat"
                class="tw-w-full"
                filled
                label="Uang Transport / Minyak (Rp)"
              />

              <q-number
                v-model="form.car_fee"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('car_fee')"
                :error-message="errors.car_fee"
                :options="page.currencyFormat"

                class="tw-w-full"
                filled
                label="Amprah Mobil (Rp/kg)"
              />
              <q-number
                v-model="form.driver_fee"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('driver_fee')"
                :error-message="errors.driver_fee"
                :options="page.currencyFormat"

                class="tw-w-full"
                filled
                label="Upah Supir (Rp/kg)"
              />
              <q-number
                v-model="form.loader_land_fee"
                :bg-color="!!form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('loader_land_fee')"
                :error-message="errors.loader_land_fee"
                :options="page.currencyFormat"

                class="tw-w-full"
                filled
                label="Upah Muat (Rp/kg)"
              />


              <q-markup-table
                bordered
                class="tw-w-full tw-col-span-2"
                dense
                flat
              >
                <thead>
                <tr>
                  <th class="text-left">Area</th>
                  <th class="text-left">Lahan</th>
                  <th class="text-right">Luas</th>
                  <th class="text-right">Jumlah Batang</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(land, l) in plantation.selected_lands" :key="l">
                  <td>{{ land.area }}</td>
                  <td>{{ land.name }}</td>
                  <td class="text-right">{{ land.wide }} Ha</td>
                  <td class="text-right">{{ new Intl.NumberFormat('id-ID').format(land.trees) }} Btg</td>
                </tr>
                </tbody>
              </q-markup-table>
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="tw-p-4"
                        v-if="can('app.perkebunan.hasilKebun.[createHasilKebun,updateHasilKebun,deleteHasilKebun]')">
          <q-btn
            v-if="can('app.perkebunan.hasilKebun.[createHasilKebun]')"
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Simpan data' : ''"
            :loading="table.loading"
            :round="$q.screen.lt.md"
            :size="$q.screen.lt.lg ? 'md' : 'lg'"
            color="secondary"
            glossy
            icon="add_circle"
            type="submit"
          >
            <q-tooltip>
              Simpan transaksi
            </q-tooltip>
          </q-btn>
          <q-btn
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Batalkan' : ''"
            :loading="table.loading"
            :round="$q.screen.lt.md"
            :size="$q.screen.lt.lg ? 'md' : 'lg'"
            color="primary"
            glossy
            icon="cancel"
            type="reset">
            <q-tooltip>
              Hapus isian yang ada di form
            </q-tooltip>
          </q-btn>
          <q-space></q-space>
          <q-btn
            v-if="can('app.perkebunan.hasilKebun.[deleteHasilKebun]')"
            :dense="$q.screen.lt.lg"
            :disable="table.selected.length !== 1"
            :label="!$q.screen.lt.md ? 'Hapus data' : ''"
            :loading="table.loading"
            :round="$q.screen.lt.md"
            :size="$q.screen.lt.lg ? 'md' : 'lg'"
            color="negative"
            glossy
            icon="delete"
            @click.stop="onDelete"
          >
            <q-tooltip>
              Hapus transaksi yang terpilih
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="can('app.perkebunan.hasilKebun.[updateHasilKebun]')"
            :dense="$q.screen.lt.lg"
            :disable="table.selected.length !== 1"
            :label="!$q.screen.lt.md ? 'Ubah data' : ''"
            :loading="table.loading"
            :round="$q.screen.lt.md"
            :size="$q.screen.lt.lg ? 'md' : 'lg'"
            color="warning"
            glossy
            icon="edit"
            @click.stop="onUpdate"
          >

            <q-tooltip>
              Ubah data transaksi yang terpilih
            </q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>

    <q-card>
      <q-table
        ref="tableRef"
        v-model:pagination="table.pagination"
        v-model:selected="table.selected"
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        selection="single"
        @request="onRequest"
      >
        <template v-slot:body-selection="scope">
          <q-checkbox v-model="scope.selected" />
        </template>
        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-driver_name="props">
          <q-td :props="props">
            <div class="tw-flex tw-flex-col">
              <div class="text-bold">{{ props.value }}</div>
              <div>{{ props.row.car_no_pol }}</div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-wide_total="props">
          <q-td :props="props" class="text-right">
            {{ `${props.value} Ha` }}
          </q-td>
        </template>

        <template v-slot:body-cell-trees_total="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID').format(props.value)
            }} Btg
          </q-td>
        </template>

        <template v-slot:body-cell-trade_cost="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-net_weight="props">
          <q-td :props="props" class="text-right">
            {{ Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-net_price="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-net_total="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-gross_total="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>
        <template v-slot:body-cell-net_income="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>


      </q-table>
    </q-card>
  </q-page>
</template>

