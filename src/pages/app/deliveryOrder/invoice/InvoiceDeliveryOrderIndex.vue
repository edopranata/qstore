<script setup>
import {useInvoiceDeliveryOrderStore} from "stores/invoice/invoiceDeliveryOrder";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {useRoute} from "vue-router";
import {onMounted, watch} from "vue";
import {date} from "quasar";

const {can} = useAuthStore()
const page = usePageStore()
const invoiceDO = useInvoiceDeliveryOrderStore()
const {table, select, form, loan, dialog} = useInvoiceDeliveryOrderStore()
const {
  errors,
  getCustomerOption,
  getSummaries: summaries,
  getForm,
  getLoan
} = storeToRefs(useInvoiceDeliveryOrderStore())
const {path, query} = useRoute()

const type = ['Customer']
onMounted(async () => {
  invoiceDO.onReset()
  await invoiceDO.getCustomersOrder(path)

  if (query.hasOwnProperty('customer_id')) {
    const selected = select.customers.filter(customer => customer.id === parseInt(query.customer_id))
    if (selected.length === 1) {
      select.selected_customer = selected[0]
      await invoiceDO.getDeliveryOrderData()
    } else {
      select.selected_customer = null
    }
  }
  table.data = []
})

watch(getCustomerOption, async (getSelected) => {
  if (getSelected !== 'Customer') {
    await invoiceDO.getDeliveryOrderData()
    await invoiceDO.calculation()
  } else {
    table.data = []
    await invoiceDO.calculation()
  }
}, {deep: true})

watch(getForm, (newForm) => {
  for (let property in newForm) {
    if (!!newForm[property]) {
      invoiceDO.unsetError(property)
    }
  }
  if (newForm) {
    if (newForm.installment >= 0) {
      loan.ending_balance = parseInt(loan.balance) - parseInt(newForm.installment)
      form.net_total = parseInt(newForm.total) - parseInt(newForm.installment)
    }
  }
}, {deep: true})
const searchCustomer = (val, update) => {
  update(() => {
    if (val === '') {
      select.customers_option = select.customers.slice(0, 10)
    } else {
      const needle = val.toLowerCase()
      select.customers_option = select.customers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1).slice(0, 10)
    }
  })
}

const onSubmit = async () => {
  await invoiceDO.submitForm(path)
}

const onReset = () => {
  invoiceDO.onReset()
}
</script>
<template>
  <q-page class="tw-space-y-4" padding>
    <q-dialog v-model="dialog.open" persistent>
      <q-card class="tw-w-96">
        <q-card-section>
        </q-card-section>
        <q-card-section class="row items-center">
          <q-avatar color="primary" icon="payments" text-color="white"/>
          <q-space></q-space>
          <div>
            <div class="q-ml-sm tw-text-sm text-right">Total terima</div>
            <div class="q-ml-sm text-h5 text-right">{{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(getForm.net_total ?? 0)
              }}
            </div>
          </div>
        </q-card-section>
        <q-checkbox v-if="can('app.deliveryOrder.dataInvoicePengepul.printInvoice')" size="lg" v-model="dialog.print" :val="dialog.print" label="Simpan dan print" />
        <q-card-actions>
          <q-btn
            v-close-popup
            :loading="table.loading"
            color="warning"
            flat
            label="Batal"/>
          <q-space></q-space>
          <q-btn
            :loading="table.loading"
            color="primary"
            flat
            label="Simpan"
            @click="onSubmit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-card bordered>
      <q-toolbar class="text-primary">
        <q-toolbar-title>
          Buat Nota / Invoice
        </q-toolbar-title>
      </q-toolbar>
      <q-form
        @reset="onReset"
        @submit="dialog.open = true"
        >
        <q-card-section class="tw-space-y-4">
          <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
            <div class="lg:tw-col-span-1 tw-col-span-2">
<!--              <div class="q-gutter-sm md:tw-mb-9">-->
<!--                <q-radio v-model="form.type" label="Pengepul" val="Customer"/>-->
<!--                <q-radio v-model="form.type" label="Hasil Kebun" val="Plantation"/>-->
<!--                <q-radio v-model="form.type" label="Jual Beli Sawit" val="Trading"/>-->
<!--              </div>-->
              <q-field
                v-if="form.type"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('trade_date')"
                :error-message="errors.trade_date"
                :stack-label="!!form.trade_date"
                class="tw-w-full"
                filled
                label="Tanggal Transaksi">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">
                    {{ date.formatDate(form.trade_date, 'DD MMMM YYYY') }}
                  </div>
                </template>
                <template v-slot:append>
                  <q-icon class="cursor-pointer" name="calendar_month" tabindex="0">
                    <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                      <q-date v-model="form.trade_date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup color="primary" flat label="Close"/>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-field>
              <q-select
                v-if="form.type === 'Customer'"
                v-model="select.selected_customer"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('customer_id')"
                :error-message="errors.customer_id"
                :options="select.customers_option"
                class="tw-w-full"
                clearable
                fill-input
                filled
                hide-selected
                label="Pelanggan"
                option-label="name"
                option-value="id"
                use-input
                @change="invoiceDO.getDeliveryOrderData()"
                @filter="searchCustomer"
                @update:model-value="invoiceDO.getDeliveryOrderData()">
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
              <div v-if="form.type === 'Customer'" class="tw-grid tw-grid-cols-2 tw-gap-x-4">
                <q-number
                  v-if="summaries.loan"
                  v-model="form.installment"
                  :dense="$q.screen.lt.md"
                  :error="errors.hasOwnProperty('installment')"
                  :error-message="errors.installment"
                  :options="page.currencyFormat"
                  class="tw-w-full"
                  filled
                  label="Jumlah angsuran"
                />
                <q-field
                  v-if="summaries.loan"
                  :dense="$q.screen.lt.md"
                  bg-color="blue-grey"
                  color="blue-grey-2"
                  filled
                  hint=""
                  label="Pinjaman (Rp)"
                  stack-label
                  tabindex="-1">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="-1">
                      {{
                        Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(summaries.loan)
                      }}
                    </div>
                  </template>
                </q-field>
                <q-field
                  v-if="summaries.loan"
                  :dense="$q.screen.lt.md"
                  bg-color="blue-grey"
                  class="tw-col-span-2"
                  color="blue-grey-2"
                  filled
                  hint=""
                  label="Sisa Pinjaman (Rp)"
                  stack-label
                  tabindex="-1">
                  <template v-slot:control>
                    <div class="self-center full-width no-outline" tabindex="-1">
                      {{
                        Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0
                        }).format(getLoan.ending_balance)
                      }}
                    </div>
                  </template>
                </q-field>
              </div>

              <div class="tw-flex tw-space-x-4">
                <q-btn
                  :dense="$q.screen.lt.lg"
                  :label="!$q.screen.lt.md ? 'Simpan data' : ''"
                  :loading="table.loading"
                  :round="$q.screen.lt.md"
                  color="secondary"
                  glossy
                  icon="add_circle"
                  type="submit"
                />
              </div>
            </div>
            <div>
              <q-field
                :dense="$q.screen.lt.md"
                bg-color="blue-grey"
                color="blue-grey-2"
                filled
                hint=""
                label="Rata-rata harga (Rp)"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(summaries.average)
                    }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                bg-color="blue-grey"
                color="blue-grey-2"
                filled
                hint=""
                label="Total berat (kg)"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'unit',
                        unit: 'kilogram'
                      }).format(summaries.weight)
                    }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                bg-color="blue-grey"
                color="blue-grey-2"
                filled
                hint=""
                label="Hasil kebun petani (Rp)"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(summaries.total)
                    }}
                  </div>
                </template>
              </q-field>
              <q-field
                :dense="$q.screen.lt.md"
                bg-color="blue-grey"
                color="blue-grey-2"
                filled
                hint=""
                label="Yang diterima petani (Rp)"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{
                      Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0
                      }).format(getForm.net_total)
                    }}
                  </div>
                </template>
              </q-field>
            </div>
          </div>
        </q-card-section>
      </q-form>
      <q-card-section class="no-padding">
        <q-table
          flat
          :columns="table.headers ?? []"
          :dense="$q.screen.lt.md"
          :grid="$q.screen.lt.md"
          :loading="table.loading"
          :rows="table.data ?? []"
          bordered
          row-key="id"
        >
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

