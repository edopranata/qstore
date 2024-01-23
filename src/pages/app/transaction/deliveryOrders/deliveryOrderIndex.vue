<script setup>
import {useDeliveryOrderStore} from "stores/transaction/deliveryOrder";
import QInputNumber from "components/Input/QInputNumber.vue";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {storeToRefs} from "pinia";

const {path} = useRoute()
const {form, table} = useDeliveryOrderStore()
const deliveries = useDeliveryOrderStore()
const {errors, customers_option, selected_customer, form: formWatcher} = storeToRefs(useDeliveryOrderStore())
const tableRef = ref()
const onRequest = async (props) => {
  await deliveries.getDeliveriesData(path, props)
}

onMounted(async () => {
  deliveries.customers_option = deliveries.customers
  tableRef.value.requestServerInteraction()
})


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
    if (selected.hasOwnProperty('id'))
      form.customer_id = selected.id
  } else {
    form.customer_id = selected
  }
})

watch(formWatcher, (calc) => {
  console.log(calc)
  if (calc.net_price && calc.net_weight && calc.margin) {
    form.net_total = calc.net_weight * calc.margin
    form.gross_total = calc.net_weight * calc.net_price
  }
}, {
  deep: true
})
const onSubmit = () => {

}

const onReset = () => {

}
</script>
<template>
  <q-page padding>
    <q-card>
      <q-table
        ref="tableRef"
        v-model:pagination="table.pagination"
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :filter="table.filter"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        row-key="id"
        @request="onRequest"
      >
        <template v-slot:top>
          <q-form
            class="tw-w-full"
            @reset="onReset"
            @submit="onSubmit"
          >
            <div class="tw-grid lg:tw-gap-4 tw-gap-2 lg:tw-grid-cols-5 md:tw-grid-cols-4 tw-grid-cols-3">
              <q-select
                v-model="deliveries.selected_customer"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('customer_id')"
                :error-message="errors.customer_id"
                :options="customers_option"
                class="tw-w-full tw-col-span-3 md:tw-col-auto"
                clearable
                fill-input
                filled
                hide-selected
                label="Customer"
                option-label="name"
                option-value="id"
                use-input
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

              <q-input
                v-model="form.delivery_date"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('delivery_date')"
                :error-message="errors.delivery_date"
                class="tw-w-full tw-col-span-3 md:tw-col-auto"
                filled
                label="Tanggal Transaksi"
                mask="##-##-####">
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="event">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                      <q-date v-model="form.delivery_date" mask="DD-MM-YYYY" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

              <q-input-number
                v-model="form.net_weight"
                :dense="$q.screen.lt.md"
                class="tw-w-full"
                filled
                label="Net Weight"
                suffix="Kg"
              />

              <q-input-number
                v-model="form.net_price"
                :dense="$q.screen.lt.md"
                class="tw-w-full"
                filled
                label="Net Price"
                prefix="Rp."
              />

              <q-input-number
                v-model="form.margin"
                :dense="$q.screen.lt.md"
                class="tw-w-full"
                filled
                label="Margin"
                prefix="Rp."
              />
              <q-input-number
                v-model="form.gross_total"
                :dense="$q.screen.lt.md"
                :disabled="true"
                filled
                label="Gross Weight"
                prefix="Rp."
              />

              <q-input-number
                v-model="form.net_total"
                :dense="$q.screen.lt.md"
                :disabled="true"
                filled
                label="Net Total"
                prefix="Rp."
              />
            </div>
          </q-form>
        </template>
        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
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

        <template v-slot:body-cell-invoice="props">
          <q-td :props="props" class="text-right">
            {{ props.value }}
          </q-td>
        </template>
        <template v-slot:body-cell-income="props">
          <q-td :props="props" class="text-right">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

