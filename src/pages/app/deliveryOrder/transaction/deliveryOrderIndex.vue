<script setup>
import {useDeliveryOrderStore} from "stores/transaction/deliveryOrder";
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted, reactive, ref, watch} from "vue";
import {storeToRefs} from "pinia";
import {date, useQuasar} from "quasar";

const page = usePageStore()
const {setting} = usePageStore()
const {path} = useRoute()
const {can} = useAuthStore()
const {form, table} = useDeliveryOrderStore()
const deliveries = useDeliveryOrderStore()
const {
  errors,
  customers_option,
  selected_customer,
  form: formField,
  getSelected: selected
} = storeToRefs(useDeliveryOrderStore())
const tableRef = ref()
const $q = useQuasar()


const onRequest = async (props) => {
  await deliveries.getDeliveriesData(path, props)
}
const calc = reactive({
  customer_weight: {type: Number, default: 0},
  customer_price: {type: Number, default: 0},
  customer_total_price: {type: Number, default: 0},
})
onMounted(async () => {
  deliveries.customers_option = deliveries.customers
  deliveries.onReset()
  if(setting.hasOwnProperty('do_margin')){
    form.margin = setting.do_margin
  }
  tableRef.value.requestServerInteraction()
})

const formattedNUmber = (calcItem, format = 'currency') => {

  const options = {}
  options.style = format

  if (format === "currency") {
    options.currency = "IDR"
  } else {
    options.unit = "kilogram"
  }

  return new Intl.NumberFormat('id-ID', options).format(calc[calcItem])
}

const searchCustomer = (val, update) => {
  update(() => {
    if (val === '') {
      deliveries.customers_option = deliveries.customers.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      deliveries.customers_option = deliveries.customers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}
watch(selected_customer, (selected) => {
  if (selected) {
    if (selected.hasOwnProperty('id')){
      form.customer_id = selected.id
      form.loan = selected.loan
    }

  } else {
    form.customer_id = selected
    form.loan = selected
  }
})

watch(formField, (newValue) => {
  for (let property in newValue) {
    if (!!newValue[property]) {
      deliveries.unsetError(property)
    }
  }
  if (newValue.net_price && newValue.net_weight && newValue.margin) {
    calc.customer_weight = newValue.net_weight

    form.gross_total = newValue.net_price * newValue.net_weight
    form.net_total = newValue.net_weight * newValue.margin

    calc.customer_weight = newValue.net_weight
    calc.customer_price = newValue.net_price - newValue.margin
    calc.customer_total_price = calc.customer_price * calc.customer_weight

  } else {
    for (let property in calc) {
      calc[property] = ''
    }
  }
}, {
  deep: true
})

const onSubmit = () => {
  $q.dialog({
    title: form.id ? 'Update data' : 'Simpan data',
    message: 'Apakah data yang di input sudah benar?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    deliveries.submitForm(path)
  })
}
const onReset = () => {
  deliveries.onReset()
}

const onDelete = () => {
  $q.dialog({
    title: 'Hapus data',
    message: '<div class="text-red">Apakah anda yakin akan menghapus data ini?</div>',
    html: true,

    cancel: true,
    persistent: true
  }).onOk(() => {
    deliveries.submitDelete(path)
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
    for (let property in form) {
      form[property] = sel[property]
    }
    if (form.customer_id) {
      let c = deliveries.customers.filter(cus => cus.id === form.customer_id)
      deliveries.selected_customer = c[0]
    }
    if (form.delivery_date) {
      form.delivery_date = form.delivery_date.split(' ')[0]
    }
  })
}
</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-card v-if="can('app.deliveryOrder.transaksiDO.createDeliveryOrder')" bordered>
      <q-form
        class="tw-w-full"
        @reset="onReset"
        @submit="onSubmit"
      >
        <q-card-section>
          <div :class="$q.screen.lt.md ? 'tw-font-bold' : 'text-h6'" class="q-mt-sm q-mb-xs">Delivery Order</div>
          <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-2">
            <q-select
              v-model="deliveries.selected_customer"
              :bg-color="!!form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('customer_id')"
              :error-message="errors.customer_id"
              :options="customers_option"
              class="tw-w-full"
              clearable
              fill-input
              filled
              hide-selected
              label="Pilih Pengepul"
              option-label="name"
              option-value="id"
              use-input
              @change="deliveries.unsetError('customer_id')"
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

            <q-field
              :bg-color="!!form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('delivery_date')"
              :error-message="errors.delivery_date"
              :stack-label="!!form.delivery_date"
              class="tw-w-full"
              filled
              label="Tanggal DO">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(form.delivery_date, 'DD MMMM YYYY') }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="event" tabindex="0">
                  <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                    <q-date v-model="form.delivery_date">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup color="primary" flat label="Close"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
            <q-field
              v-if="form.loan > 0"
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Pinjaman petani"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: "IDR"}).format(form.loan ?? 0) }}
                </div>
              </template>
            </q-field>

          </div>
          <div :class="$q.screen.lt.md ? 'tw-font-bold' : 'text-h6'" class="q-mt-sm q-mb-xs">Data Timbangan Pabrik</div>
          <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-3">
            <q-number
              v-model="form.net_weight"
              :bg-color="!!form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('net_weight')"
              :error-message="errors.net_weight"
              :options="page.unitFormat"
              class="tw-w-full"
              filled
              label="Berat bersih (pabrik)"
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
              label="Harga Pabrik"
            />
            <q-number
              v-model="form.margin"
              :bg-color="!!form.id ? 'yellow-2' : ''"
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('margin')"
              :error-message="errors.margin"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Margin"
            />

            <q-field
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Terima dari pabrik (Bruto)"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: "IDR"}).format(form.gross_total) }}
                </div>
              </template>
            </q-field>

            <q-field
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Pendapatan Bersih (netto)"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: "IDR"}).format(form.net_total) }}
                </div>
              </template>
            </q-field>

          </div>
          <div :class="$q.screen.lt.md ? 'tw-font-bold' : 'text-h6'" class="q-mt-sm q-mb-xs">Beli dari Petani</div>
          <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-3">
            <q-field
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Berat Bersih (pabrik)"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{ formattedNUmber('customer_weight', 'unit') }}
                </div>
              </template>
            </q-field>
            <q-field
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Harga jual (petani)"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">{{ formattedNUmber('customer_price') }}
                </div>
              </template>
            </q-field>

            <q-field
              tabindex="-1"
              bg-color="blue-grey"
              color="blue-grey-2"
              :dense="$q.screen.lt.md"
              filled
              label="Total terima (petani)"
              stack-label>
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{ formattedNUmber('customer_total_price') }}
                </div>
              </template>
            </q-field>
          </div>
        </q-card-section>
        <q-card-actions class="tw-p-4">
          <q-btn
            v-if="can('app.deliveryOrder.transaksiDO.createDeliveryOrder')"
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
              Simpan transaksi DO
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
            v-if="can('app.deliveryOrder.transaksiDO.deleteDeliveryOrder')"
            :dense="$q.screen.lt.lg"
            :disable="selected.length !== 1"
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
              Hapus transaksi DO yang terpilih
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="can('app.deliveryOrder.transaksiDO.updateDeliveryOrder')"
            :dense="$q.screen.lt.lg"
            :disable="selected.length !== 1"
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
              Ubah data transaksi DO yang terpilih
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
          <q-checkbox v-model="scope.selected"
                      :disable="scope.row.customer_name === 'Plantation' || scope.row.customer_name === 'Trading'"/>
        </template>

        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>

        <template v-slot:body-cell-invoice_status="props">
          <q-td :props="props" class="text-left">
            <div v-if="props.value">
              {{ props.value }}
            </div>
            <q-btn
              v-else
              :disable="props.row.customer_name === 'Plantation' || props.row.customer_name === 'Trading'"
              :dense="$q.screen.lt.lg"
              :label="!$q.screen.lt.md ? 'Buat Invoice' : ''"
              :loading="table.loading"
              :round="$q.screen.lt.md"
              glossy
              icon="print"
              size="sm"
              :to="{name: 'app.deliveryOrder.buatInvoiceDO.index', query: {customer_id: props.row.customer_id}}"
            >
              <q-tooltip>
                Buat invoice untuk pengepul ini
              </q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-net_weight="props">
          <q-td :props="props" class="text-right">
            {{ Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(props.value) }}
          </q-td>
        </template>

        <template v-slot:body-cell-net_price="props">
          <q-td :props="props" class="tw-max-w-44">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-margin="props">
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

        <template v-slot:body-cell-net_customer="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
              }).format(props.row.gross_total - props.row.net_total)
            }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

