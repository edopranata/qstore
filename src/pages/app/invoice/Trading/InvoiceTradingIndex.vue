<script setup>
import {useInvoiceTradingStore} from "stores/invoice/invoiceTrading";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {onMounted, watch} from "vue";
import {useRoute} from "vue-router";
import InvoiceTradingDetails from "pages/app/invoice/Trading/InvoiceTradingDetails.vue";
import {date} from "quasar";
import {storeToRefs} from "pinia";

const {can} = useAuthStore()
const page = usePageStore()
const trading = useInvoiceTradingStore()
const {table, form, dialog} = useInvoiceTradingStore()
const {errors, getSelected: selected, getSummaries: summaries} = storeToRefs(useInvoiceTradingStore())
const {path} = useRoute()

onMounted(async () => {
  await trading.getCustomerTrade(path)
})

watch(selected, (sel) => {
  if (sel) {
    form.trade_details_id = sel.hasOwnProperty('trades') ? sel.trades.map(item => item.id) : []
    form.customer_id = sel.hasOwnProperty('id') ? sel.id : ''
  } else {
    form.trade_details_id = []
    form.customer_id = ''
  }
})
const onCheck = () => {
  form.installment = 0
}

const onSubmit = async () => {
  await trading.submitForm(path)
}

const onReset = () => {
  table.selected = []
  form.trade_date = ''
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
                }).format(summaries ?? 0)
              }}
            </div>
          </div>
        </q-card-section>
        <q-checkbox v-if="can('app.invoice.invoiceData.printInvoice')" v-model="dialog.print" :val="dialog.print"
                    label="Simpan dan print" size="lg"/>
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
    <q-card-section>
      <q-card-section class="tw-space-y-4">
        <q-form
          @reset="onReset"
          @submit="dialog.open = true"
        >
          <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
            <div class="lg:tw-col-span-1 tw-col-span-2">
              <q-field
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('trade_date')"
                :error-message="errors.trade_date"
                :stack-label="!!form.trade_date"
                class="tw-w-full"
                filled
                label="Tanggal Invoice">
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
              <div class="tw-grid tw-grid-cols-2 tw-gap-x-4">
                <q-number
                  v-if="selected.loan"
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
                  v-if="selected.loan"
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
                        }).format(selected.hasOwnProperty('loan') ? selected.loan : 0)
                      }}
                    </div>
                  </template>
                </q-field>
                <q-field
                  v-if="selected.loan"
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
                        }).format(selected.hasOwnProperty('loan') ? selected.loan : 0)
                      }}
                    </div>
                  </template>
                </q-field>
              </div>

              <div class="tw-flex tw-space-x-4">
                <q-btn
                  :dense="$q.screen.lt.lg"
                  :loading="table.loading"
                  :round="$q.screen.lt.md"
                  color="secondary"
                  glossy
                  icon="add_circle"
                  label="Simpan data"
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
                      }).format(selected.hasOwnProperty('trade_price') ? parseFloat(selected.trade_price) : 0)
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
                      }).format(selected.hasOwnProperty('trade_weight') ? parseFloat(selected.trade_weight) : 0)
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
                      }).format(selected.hasOwnProperty('trade_total') ? parseFloat(selected.trade_total) : 0)
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
                      }).format(parseFloat(summaries) ?? 0)
                    }}
                  </div>
                </template>
              </q-field>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card-section>
    <q-card-section class="no-padding">
      <q-table
        v-model:selected="table.selected"
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        flat
        row-key="id"
        selection="single"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width/>
            <q-th>Details</q-th>

            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-checkbox v-model="props.selected" @click="onCheck(props.row)"/>
            </q-td>
            <q-td auto-width>
              <q-btn :icon="props.expand ? 'remove' : 'add'" color="accent" dense round size="sm"
                     @click="props.expand = !props.expand"/>
            </q-td>
            <q-td>
              {{ props.rowIndex + 1 }}
            </q-td>
            <q-td>
              <div>{{ props.row.name }}</div>
              <div class="tw-text-xs">{{ props.row.phone }}</div>
            </q-td>
            <q-td class="text-right">
              <div>{{
                  Intl.NumberFormat('id-ID', {
                    style: 'unit',
                    unit: 'kilogram'
                  }).format(props.row.hasOwnProperty('trade_weight') ? props.row.trade_weight : 0)
                }}
              </div>
            </q-td>
            <q-td class="text-right">
              <div>{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 2
                  }).format(props.row.hasOwnProperty('trade_price') ? props.row.trade_price : 0)
                }}
              </div>
            </q-td>
            <q-td class="text-right">
              <div>{{
                  Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 2
                  }).format(props.row.hasOwnProperty('trade_total') ? props.row.trade_total : 0)
                }}
              </div>
            </q-td>
            <q-td>
              {{ props.row.created_by }}
            </q-td>
            <q-td>
              {{ props.row.created_at }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <invoice-trading-details :details="props.row.trades"/>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-page>
</template>

