<script setup>
import {useTradingsStore} from "stores/transaction/tradings";
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {date, useQuasar} from "quasar";
import {storeToRefs} from "pinia";

const $q = useQuasar()
const page = usePageStore()
const {setting} = usePageStore()
const {path} = useRoute()
const {can} = useAuthStore()
const {parent} = useTradingsStore()
const {errors, getSelectedCar, getSelectedDriver, getParentSelected: selected} = storeToRefs(useTradingsStore())
const trading = useTradingsStore()

const tableRef = ref()

onMounted(async () => {
  trading.onReset()
  for (let property in setting){
    if(parent.form.hasOwnProperty(property)){
      parent.form[property] = setting[property]
    }
  }
  tableRef.value.requestServerInteraction()
})

watch([getSelectedCar, getSelectedDriver], ([carSel, driverSel]) => {
  if (carSel) {
    if (carSel.hasOwnProperty('id'))
      parent.form.car_id = carSel.id
  } else {
    parent.form.car_id = carSel
  }
  if (driverSel) {
    if (driverSel.hasOwnProperty('id'))
      parent.form.driver_id = driverSel.id
  } else {
    parent.form.driver_id = driverSel
  }
})

const onRequest = async (props) => {
  await trading.getTradeData(path, props)
}

const searchCar = (val, update) => {
  update(() => {
    if (val === '') {
      parent.cars_option = parent.cars.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      parent.cars_option = parent.cars.filter(({no_pol}) => no_pol.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}

const searchDriver = (val, update) => {
  update(() => {
    if (val === '') {
      parent.drivers_option = parent.drivers.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      parent.drivers_option = parent.drivers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}
const onReset = () => {
  trading.onReset()
}
const onSubmit = () => {
  $q.dialog({
    title: parent.form.id ? 'Update data' : 'Simpan data',
    message: 'Apakah data yang di input sudah benar?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    trading.submitTradingForm(path)
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
    trading.submitTradingDelete(path)
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
    const sel = parent.table.selected.length === 1 ? parent.table.selected[0] : []

    for (let property in parent.form) {
      parent.form[property] = sel[property]
    }
    if (parent.form.car_id) {
      let c = parent.cars.filter(cus => cus.id === parent.form.car_id)
      parent.selected_car = c[0]
    }
    if (parent.form.driver_id) {
      let d = parent.drivers.filter(drive => drive.id === parent.form.driver_id)
      parent.selected_driver = d[0]
    }
    if (parent.form.trade_date) {
      parent.form.trade_date = parent.form.trade_date.split(' ')[0]
    }
  })
}
</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-card v-if="can('app.transaction.pembelianSawit.[createTransaction]')" bordered>
      <q-form
        class="tw-w-full"
        @reset="onReset"
        @submit="onSubmit"
      >
        <q-card-section>
          <div :class="$q.screen.lt.md ? 'tw-font-bold' : 'text-h6'" class="q-mt-sm q-mb-xs">Pembelian sawit petani
          </div>
          <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-2">
            <q-field
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('trade_date')"
              :error-message="errors.trade_date"
              :stack-label="!!parent.form.trade_date"
              class="tw-w-full"
              filled
              label="Tanggal Transaksi">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(parent.form.trade_date, 'DD MMMM YYYY') }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="calendar_month" tabindex="0">
                  <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                    <q-date v-model="parent.form.trade_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup color="primary" flat label="Close"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
            <q-select
              v-model="parent.selected_car"
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('car_id')"
              :error-message="errors.car_id"
              :options="parent.cars_option"
              class="tw-w-full"
              clearable
              fill-input
              filled
              hide-selected
              label="Mobil"
              option-label="no_pol"
              option-value="id"
              use-input
              @change="parent.unsetError('car_id')"
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
              v-model="parent.selected_driver"
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('driver_id')"
              :error-message="errors.driver_id"
              :options="parent.drivers_option"
              class="tw-w-full"
              clearable
              fill-input
              filled
              hide-selected
              label="Supir"
              option-label="name"
              option-value="id"
              use-input
              @change="parent.unsetError('driver_id')"
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
          </div>
          <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-2">
            <q-number
              v-model="parent.form.trade_cost"
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('trade_cost')"
              :error-message="errors.trade_cost"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Uang Jalan (Rp)"
            />

            <q-number
              v-model="parent.form.car_fee"
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('car_fee')"
              :error-message="errors.car_fee"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Amprah Mobil (Rp/kg)"
            />

            <q-number
              v-model="parent.form.driver_fee"
              :bg-color="!!parent.form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('driver_fee')"
              :error-message="errors.driver_fee"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Upah Supir (Rp/kg)"
            />
          </div>
        </q-card-section>
        <q-card-actions class="tw-p-4">
          <q-btn
            v-if="can('app.transaction.pembelianSawit.[createTransaction]')"
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Simpan data' : ''"
            :loading="parent.table.loading"
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
            v-if="can('app.transaction.pembelianSawit.[createTransaction]')"
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Batalkan' : ''"
            :loading="parent.table.loading"
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
            v-if="can('app.transaction.pembelianSawit.deleteTransaction')"
            :dense="$q.screen.lt.lg"
            :disable="selected.length !== 1"
            :label="!$q.screen.lt.md ? 'Hapus data' : ''"
            :loading="parent.table.loading"
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
            v-if="can('app.transaction.pembelianSawit.updateTransaction')"
            :dense="$q.screen.lt.lg"
            :disable="selected.length !== 1"
            :label="!$q.screen.lt.md ? 'Ubah data' : ''"
            :loading="parent.table.loading"
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
        v-model:pagination="parent.table.pagination"
        v-model:selected="parent.table.selected"
        :columns="parent.table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="parent.table.filter"
        :loading="parent.table.loading"
        :rows="parent.table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        selection="single"
        @request="onRequest"
      >
        <template v-slot:body-selection="scope">
          <q-checkbox v-model="scope.selected"
                      :disable="scope.row.trade_status !== null"/>
        </template>
        <template v-slot:body-cell-action="props">
          <q-td :props="props">
            <q-btn
              :dense="$q.screen.lt.lg"
              :label="!$q.screen.lt.md ? 'Edit Details' : ''"
              :loading="parent.table.loading"
              :round="$q.screen.lt.md"
              :disable="props.row.trade_status !== null"
              glossy
              :to="`${path}/${props.row.id}/details`"
              icon="visibility"
              size="sm"
            >
              <q-tooltip>
                Lihat atau edit detail transaksi
              </q-tooltip>
            </q-btn>
          </q-td>
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

        <template v-slot:body-cell-customer_average_price="props">
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

        <template v-slot:body-cell-customer_total_price="props">
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

        <template v-slot:body-cell-customer_total_weight="props">
          <q-td :props="props" class="text-right">
            {{ Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(props.value) }}
          </q-td>
        </template>

      </q-table>
    </q-card>
  </q-page>
</template>

