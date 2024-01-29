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
const {path} = useRoute()
const {can} = useAuthStore()
const {details} = useTradingsStore()
const {
  errors,
  getSelectedCustomer,
  getDetailsSelected: selected,
  details: tradeDetails,
  getDetailsFormField: formField
} = storeToRefs(useTradingsStore())
const trading = useTradingsStore()

const tableRef = ref()

onMounted(async () => {
  tableRef.value.requestServerInteraction()
})

watch([getSelectedCustomer, formField], ([cusSel, formDetails]) => {
  if (cusSel) {
    if (cusSel.hasOwnProperty('id'))
      details.form.customer_id = cusSel.id
  } else {
    details.form.customer_id = cusSel
  }
  if (formDetails.price && formDetails.weight) {
    details.form.total = formDetails.price * formDetails.weight
  }
}, {deep: true})

const onRequest = async (props) => {
  await trading.getDetailsTradeData(path, props)
}

const searchCustomer = (val, update) => {
  update(() => {
    if (val === '') {
      details.customers_option = details.customers.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      details.customers_option = details.customers.filter(({no_pol}) => no_pol.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}
const onReset = () => {
  trading.onReset('details')
}
const onSubmit = () => {
  $q.dialog({
    title: details.form.id ? 'Update data' : 'Simpan data',
    message: 'Apakah data yang di input sudah benar?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    trading.submitTradingForm(path, 'details')
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
    trading.submitTradingDelete(path, 'details')
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
    const sel = details.table.selected.length === 1 ? details.table.selected[0] : []

    for (let property in details.form) {
      details.form[property] = sel[property]
    }
    if (details.form.customer_id) {
      let c = details.customers.filter(cus => cus.id === details.form.customer_id)
      details.selected_customer = c[0]
    }
  })
}
</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-card bordered>
      <q-form
        class="tw-w-full"
        @reset="onReset"
        @submit="onSubmit"
      >
        <q-card-section>
          <div class="tw-flex tw-flex-col-reverse md:tw-grid md:tw-gap-4 md:tw-grid-cols-2">
            <div class="tw-grid tw-gap-2 tw-grid-cols-3 tw-content-start">
              <div class="tw-font-bold tw-col-span-3">Data timbangan kebun</div>
              <q-select
                v-model="details.selected_customer"
                :bg-color="!!details.form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('customer_id')"
                :error-message="errors.customer_id"
                :options="details.customers_option"
                class="tw-w-full tw-col-span-3"
                clearable
                fill-input
                filled
                hide-selected
                label="Customer"
                option-label="name"
                option-value="id"
                use-input
                @change="details.unsetError('customer_id')"
                @filter="searchCustomer">
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section avatar>
                      <q-icon name="person"/>
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
              <q-number
                v-model="details.form.weight"
                :bg-color="!!details.form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('weight')"
                :error-message="errors.weight"
                :options="page.unitFormat"
                class="tw-w-full"
                filled
                label="Berat (kg)"
              />
              <q-number
                v-model="details.form.price"
                :bg-color="!!details.form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('price')"
                :error-message="errors.price"
                :options="page.currencyFormat"
                class="tw-w-full"
                filled
                label="Harga (Rp)"
              />
              <q-field
                :bg-color="!!details.form.id ? 'yellow-2' : ''"
                :dense="$q.screen.lt.md"
                filled
                hint=""
                label="Total (Rp)"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(formField.total)
                    }}
                  </div>
                </template>
              </q-field>
            </div>
            <div class="tw-grid tw-gap-2 tw-grid-cols-2 tw-content-start">
              <div class="tw-font-bold tw-col-span-2">Mobil/Supir dan uang jalan</div>
              <q-field
                :dense="$q.screen.lt.md"
                filled
                hint=""
                label="Tanggal Transaksi"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      tradeDetails.trading.trade_date ? date.formatDate(tradeDetails.trading.trade_date.split(' ')[0], 'DD MMMM YYYY') : ''
                    }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                filled
                hint=""
                label="Mobil"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{ tradeDetails.trading.car_no_pol }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                filled
                hint=""
                label="Supir"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{ tradeDetails.trading.driver_name }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                filled
                hint=""
                label="Uang Jalan"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(tradeDetails.trading.trade_cost)
                    }}
                  </div>
                </template>
              </q-field>
            </div>
          </div>
        </q-card-section>
        <q-card-actions>
          <q-btn
            v-if="can('app.transaction.pembelianSawit.[createTransaction]')"
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Simpan data' : ''"
            :loading="details.table.loading"
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
            :loading="details.table.loading"
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
            :loading="details.table.loading"
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
            :loading="details.table.loading"
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
        v-model:pagination="details.table.pagination"
        v-model:selected="details.table.selected"
        :columns="details.table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="details.table.filter"
        :loading="details.table.loading"
        :rows="details.table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        selection="single"
        @request="onRequest"
      >
        <template v-slot:top>
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
        <template v-slot:body-cell-weight="props">
          <q-td :props="props" class="text-right">
            {{ Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-price="props">
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

        <template v-slot:body-cell-total="props">
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

