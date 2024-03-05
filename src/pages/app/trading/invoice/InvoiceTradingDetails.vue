<script setup>
import {useInvoiceTradingStore} from "stores/invoice/invoiceTrading";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import {date} from "quasar";
import {storeToRefs} from "pinia";

const {can} = useAuthStore()
const page = usePageStore()
const trading = useInvoiceTradingStore()
const {details: table, form, dialog} = useInvoiceTradingStore()
const {errors, getSummaries: summaries} = storeToRefs(useInvoiceTradingStore())
const {path} = useRoute()
onMounted(async () => {
  await trading.getSingleCustomerTrade(path)
})

const onSubmit = async () => {
  await trading.submitForm(path)
}

</script>

<template>
  <q-page padding>
    <q-card>
      <q-card-section class="tw-space-y-4">
        <q-toolbar class="text-primary">
          <q-toolbar-title>
            Buat Invoice untuk {{ table.customer?.name }}
          </q-toolbar-title>
        </q-toolbar>

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
                    }).format(summaries.hasOwnProperty('net_total')  ? summaries.net_total : 0)
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
        <q-form
          @submit="dialog.open = true"
        >
          <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
            <div class="lg:tw-col-span-1 tw-col-span-2">
              <q-field
                :dense="$q.screen.lt.md"
                bg-color="blue-grey"
                color="blue-grey-2"
                filled
                hint=""
                label="Petani"
                stack-label
                tabindex="-1">
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="-1">
                    {{ table.customer?.name }}
                  </div>
                </template>
              </q-field>
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
                  v-if="summaries.loan_status"
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
                  v-if="summaries.loan_status"
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
                        }).format(summaries.hasOwnProperty('loan') ? summaries.loan : 0)
                      }}
                    </div>
                  </template>
                </q-field>
                <q-field
                  v-if="summaries.loan_status"
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
                        }).format(summaries.hasOwnProperty('loan_total') ? summaries.loan_total : 0)
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
                      }).format(summaries.hasOwnProperty('price') ? summaries.price : 0)
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
                      }).format(summaries.hasOwnProperty('weight') ? summaries.weight : 0)
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
                      }).format(summaries.hasOwnProperty('total') ? summaries.total : 0)
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
                      }).format(summaries.hasOwnProperty('net_total') ? summaries.net_total : 0)
                    }}
                  </div>
                </template>
              </q-field>
            </div>
          </div>
        </q-form>
      </q-card-section>
      <q-table
        title="Detail timbangan lapangan"
        :rows="table.data"
        :columns="table.headers"
        row-key="id"
      >
        <template v-slot:body-cell-no="props">
          <q-td :props="props">
            {{ props.rowIndex + 1 }}
          </q-td>
        </template>
        <template v-slot:body-cell-car="props">
          <q-td>
            <div class="tw-flex tw-flex-col">
              <div class="text-bold">{{ props.row.driver?.name }}</div>
              <div>{{ props.row.car?.no_pol }}</div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-weight="props">
          <q-td :props="props" class="text-right">
            {{
              Intl.NumberFormat('id-ID', {
                style: 'unit',
                unit: 'kilogram',
                minimumFractionDigits: 0
              }).format(props.value)
            }}
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

