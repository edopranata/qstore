<script setup>
import {useLoanStore} from "stores/loan/loan";
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {storeToRefs} from "pinia";
import {onBeforeMount, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {date, useQuasar} from "quasar";

const page = usePageStore()
const {can} = useAuthStore()
const router = useRouter()
const {table, select, modal} = useLoanStore()
const {path} = useRoute()
const {errors, getSelectedType, getSelectedCustomer, getModal} = storeToRefs(useLoanStore())
const loan = useLoanStore()

const $q = useQuasar()
const tableRef = ref()

onBeforeMount( async () => {
  modal.in = false
  modal.out = false
  await loan.onReset()
  await loan.loadAllCustomers(path)
})
watch(getSelectedType, (selectedType) => {
  if (selectedType) {
    select.selected_customer = null
    table.data = []
  }
})

watch(getModal, (modals) => {
  if (modals.in || modals.out) {
    select.amount = null
    select.amount = null
    select.installment = null
  }
}, {deep: true})

watch(getSelectedCustomer, (selectedCustomer) => {
  if (selectedCustomer) {
    select.customer_id = selectedCustomer.hasOwnProperty('id') ? selectedCustomer.id : selectedCustomer
    select.loan_id = selectedCustomer.hasOwnProperty('loan') ? selectedCustomer.loan.id : selectedCustomer
  } else {
    select.customer_id = null
    select.loan_id = null
    select.amount = null
    select.isntallment = null
  }
})

const getLoanList = () => {
  table.filter = String(Date.now())
}

const onRequest = async (props) => {
  await loan.getLoanData(path, props)
}

const onPrint = async (invoice) => {
  if (invoice)
    $q.dialog({
      title: 'Print invoice',
      message: `Invoice number : ${invoice}`,
      cancel: true,
      persistent: true
    }).onOk(async () => {
      await router.replace({name: 'app.invoice.invoiceData.printInvoice', params: {invoice_number: invoice}})
    })
}

const searchCustomer = (val, update) => {
  update(() => {
    const customers = select.customers.filter(customer => customer.type === select.type)
    if (val !== '') {
      const needle = val.toLowerCase()
      select.customers_option = customers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1)
    } else {
      select.customers_option = customers.slice(0, 10)
    }
  })
}

const onSubmit = async () => {
  await loan.submitLoan(path)
}
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-dialog v-model="modal.in" persistent transition-hide="scale" transition-show="scale">
      <q-card style="width: 450px">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            <div>Tambah Pinjaman</div>
            <div class="tw-text-xs">{{ getSelectedCustomer?.name }}</div>
          </q-toolbar-title>
          <q-btn v-close-popup dense flat icon="close" round/>
        </q-toolbar>

        <q-form
          @submit="onSubmit"
        >
          <q-card-section>
            <q-field
              :dense="$q.screen.lt.md"
              bg-color="blue-grey"
              color="blue-grey-2"
              filled
              hint=""
              label="Sisa pinjaman (Rp)"
              stack-label
              tabindex="-1">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{
                    Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(getSelectedCustomer?.loan?.balance ?? 0)
                  }}
                </div>
              </template>
            </q-field>
            <q-field
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('trade_date')"
              :error-message="errors.trade_date"
              :stack-label="!!select.trade_date"
              filled
              label="Tanggal Transaksi">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(select.trade_date, 'DD MMMM YYYY') }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="calendar_month" tabindex="0">
                  <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                    <q-date v-model="select.trade_date" @focusout="loan.unsetError('trade_date')">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup color="primary" flat label="Close"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
            <q-number
              v-model="select.amount"
              :error="errors.hasOwnProperty('amount')"
              :error-message="errors.amount"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Jumlah pinjam (Rp)"
            />
            <q-checkbox v-if="can('app.invoice.invoiceData.printInvoice')" v-model="select.print" :val="select.print" label="Simpan dan Print"/>

          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn v-close-popup :loading="table.loading" color="negative" flat label="Batal"/>
            <q-space/>
            <q-btn :loading="table.loading" color="primary" flat label="Simpan" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-dialog v-model="modal.out" persistent transition-hide="scale" transition-show="scale">
      <q-card style="width: 450px">
        <q-toolbar class="bg-warning text-white">
          <q-toolbar-title>
            <div>Angsuran Pinjaman</div>
            <div class="tw-text-xs">{{ getSelectedCustomer?.name }}</div>
          </q-toolbar-title>
          <q-btn v-close-popup dense flat icon="close" round/>
        </q-toolbar>
        <q-form
          @submit="onSubmit"
        >
          <q-card-section>
            <q-field
              :dense="$q.screen.lt.md"
              bg-color="blue-grey"
              color="blue-grey-2"
              filled
              hint=""
              label="Sisa pinjaman (Rp)"
              stack-label
              tabindex="-1">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="-1">
                  {{
                    Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0
                    }).format(getSelectedCustomer?.loan?.balance ?? 0)
                  }}
                </div>
              </template>
            </q-field>
            <q-field
              :dense="$q.screen.lt.md"
              :error="errors.hasOwnProperty('trade_date')"
              :error-message="errors.trade_date"
              :stack-label="!!select.trade_date"
              filled
              label="Tanggal Transaksi">
              <template v-slot:control>
                <div class="self-center full-width no-outline" tabindex="0">
                  {{ date.formatDate(select.trade_date, 'DD MMMM YYYY') }}
                </div>
              </template>
              <template v-slot:append>
                <q-icon class="cursor-pointer" name="calendar_month" tabindex="0">
                  <q-popup-proxy cover transition-hide="scale" transition-show="scale">
                    <q-date v-model="select.trade_date" @focusout="loan.unsetError('trade_date')">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup color="primary" flat label="Close"/>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-field>
            <q-number
              v-model="select.installment"
              :error="errors.hasOwnProperty('installment')"
              :error-message="errors.installment"
              :options="page.currencyFormat"
              class="tw-w-full"
              filled
              label="Jumlah Angsuran (Rp)"
            />
            <q-checkbox v-if="can('app.invoice.invoiceData.printInvoice')" v-model="select.print" :val="select.print" label="Simpan dan Print"/>

          </q-card-section>
          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn v-close-popup :loading="table.loading" color="negative" flat label="Batal"/>
            <q-space/>
            <q-btn :loading="table.loading" color="warning" flat label="Simpan" type="submit"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
    <q-card>
      <q-card-section>
        <q-toolbar class="text-primary">
          <q-toolbar-title>
            Data mutasi pinjaman
          </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-card-section class="tw-space-y-4">
        <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
          <div class="lg:tw-col-span-1 tw-col-span-2">
            <div class="q-gutter-sm md:tw-mb-11">
              <q-radio v-model="select.type" label="Petani" val="farmers"/>
              <q-radio v-model="select.type" label="Pengepul" val="collector"/>
              <q-radio v-model="select.type" label="Supir" val="driver"/>
            </div>
            <q-select
              v-if="!!select.type"
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
              @filter="searchCustomer"
              @update:model-value="getLoanList"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="person"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                    <q-item-label caption>
                      <q-icon name="boy"/>
                      {{ scope.opt.type }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    List empty
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="no-padding">
        <q-table
          v-model:pagination="table.pagination"
          v-model:selected="table.selected"
          :columns="table.headers ?? []"
          :dense="$q.screen.lt.md"
          :filter="table.filter"
          :loading="table.loading"
          :rows="table.data ?? []"
          binary-state-sort
          bordered
          flat
          row-key="id"
          @request="onRequest"
        >
          <template v-slot:top>
            <div class="tw-flex tw-space-x-2 tw-w-full">
              <q-btn
                v-if="can('app.pinjaman.pinjamanBaru.[index,simpanPinjamanBaru]')"
                :dense="$q.screen.lt.lg"
                :loading="table.loading"
                :to="{name: 'app.pinjaman.pinjamanBaru.index'}"
                color="secondary"
                glossy
                icon="add_circle"
                label="Pinjaman Baru"
                type="submit"
              >
                <q-tooltip>
                  Pinjaman Baru (Pelanggan / Supir)
                </q-tooltip>
              </q-btn>
              <q-space></q-space>
              <q-btn
                v-if="can('app.pinjaman.dataPinjaman.index')"
                :dense="$q.screen.lt.lg"
                :disable="!select.customer_id"
                :loading="table.loading"
                color="primary"
                glossy
                icon="trending_up"
                label="Tambah pinjaman"
                @click="modal.in = true"
              >
                <q-tooltip>
                  Hapus transaksi yang terpilih
                </q-tooltip>
              </q-btn>
              <q-btn
                v-if="can('app.pinjaman.dataPinjaman.index')"
                :dense="$q.screen.lt.lg"
                :disable="!select.customer_id"
                :loading="table.loading"
                color="warning"
                glossy
                icon="trending_down"
                label="Angsuran pinjaman"
                @click="modal.out = true"

              >

                <q-tooltip>
                  Ubah data transaksi yang terpilih
                </q-tooltip>
              </q-btn>
            </div>
          </template>
          <template v-slot:body-cell-no="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
          <template v-slot:body-cell-invoice="props">
            <q-td :props="props">
              <q-chip
                v-if="can('app.invoice.invoiceData.printInvoice')"
                clickable
                color="primary"
                icon="print"
                text-color="white"
                @click="onPrint(props.row.invoice?.invoice_number)">
                {{ props.row.invoice?.invoice_number }}
              </q-chip>
              <q-chip
                v-else
                color="primary"
                icon="print"
                text-color="white"
              >
                {{ props.row.invoice?.invoice_number }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-opening_balance="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.row.opening_balance)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-debit="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.value > 0 ? props.value : 0)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-credit="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.value < 0 ? props.value * -1 : 0)
              }}
            </q-td>
          </template>
          <template v-slot:body-cell-ending_balance="props">
            <q-td :props="props">
              {{
                Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.row.opening_balance + props.value)
              }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

