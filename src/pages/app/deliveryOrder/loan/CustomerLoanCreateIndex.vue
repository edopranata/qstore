<script setup>
import {useLoanCreateStore} from "stores/loan/createLoan";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import {date} from "quasar";

const router = useRouter()
const page = usePageStore()
const {can} = useAuthStore()
const {select, form, table, dialog} = useLoanCreateStore()
const {path} = useRoute()
const {errors, getSelectedType, getSelectedCustomer} = storeToRefs(useLoanCreateStore())
const loan = useLoanCreateStore()


onMounted(async () => {
  loan.onReset()
  await loan.loadAllCustomers(path)
  form.type = 'collector'
})

watch(getSelectedType, (selectedType) => {
  if (selectedType) {
    select.selected_customer = null
    form.balance = ''
    form.trade_date = null
  }
})

watch(getSelectedCustomer, (selectedCustomer) => {
  form.customer_id = selectedCustomer ? selectedCustomer.id : selectedCustomer
})

const searchCustomer = (val, update) => {
  update(() => {
    const customers = select.customers.filter(customer => customer.type === form.type)
    if (val !== '') {
      const needle = val.toLowerCase()
      select.customers_option = customers.filter(({name}) => name.toLowerCase().indexOf(needle) > -1)
    } else {
      select.customers_option = customers.slice(0, 10)
    }
  })
}

const onSubmit = async () => {
  const data = await loan.submitForm(path)

  if(data){
    await router.replace({name: 'app.deliveryOrder.dataPinjamanPengepul.index'})
  }
}

const onReset = () => {
  loan.onReset()
  select.type = 'collector'
}
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-form
      class="tw-w-full"
      @reset="onReset"
      @submit="dialog.open = true"
    >
      <q-dialog v-model="dialog.open" persistent>
        <q-card class="tw-w-96">
          <q-card-section class="row items-center">
            <q-avatar color="primary" icon="payments" text-color="white"/>
            <q-space></q-space>
            <div>
              <div class="q-ml-sm tw-text-sm text-right">Jumlah Pinjaman</div>
              <div class="q-ml-sm text-h5 text-right">{{
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(form.balance ?? 0)
                }}
              </div>
            </div>
          </q-card-section>
          <q-checkbox v-if="can('app.invoice.invoiceData.printInvoice')" v-model="dialog.print" :val="dialog.print" label="Simpan dan print" size="lg"/>
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
        <q-card-section>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Tambah data pinjaman
            </q-toolbar-title>
          </q-toolbar>
        </q-card-section>
        <q-card-section class="tw-space-y-4">
          <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
            <div class="lg:tw-col-span-1 tw-col-span-2">
              <div class="q-gutter-sm md:tw-mb-11">
                <q-radio class="hidden" v-model="form.type" label="Pengepul" val="farmer"/>
              </div>
              <q-field
                v-if="!!form.type"
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
                  <q-icon class="cursor-pointer" name="event" tabindex="0">
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
                v-if="!!form.type"
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
                label="Pengepul"
                option-label="name"
                option-value="id"
                use-input
                @filter="searchCustomer"
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
              <q-number
                v-if="!!form.type"
                v-model="form.balance"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('balance')"
                :error-message="errors.balance"
                :options="page.currencyFormat"
                class="tw-w-full"
                filled
                label="Jumlah Pinjaman (Rp)"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions class="tw-p-4">
          <q-btn
            v-if="!!form.type && can('app.deliveryOrder.pinjamanBaru.simpanPinjamanBaru')"
            :dense="$q.screen.lt.lg"
            :label="!$q.screen.lt.md ? 'Simpan data' : ''"
            :loading="table.loading"
            :round="$q.screen.lt.md"
            color="secondary"
            glossy
            icon="add_circle"
            type="submit"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>

