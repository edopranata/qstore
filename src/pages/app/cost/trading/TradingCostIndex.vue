<script setup>
import {useTradingCostStore} from "stores/cost/tradingCost";
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {useRoute} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {date, useQuasar} from "quasar";
import {storeToRefs} from "pinia";

const {can} = useAuthStore()
const page = usePageStore()
const {path} = useRoute()
const cost = useTradingCostStore()
const {table, form, select} = useTradingCostStore()
const {errors, getSelected: selected, form: formField,} = storeToRefs(useTradingCostStore())
const $q = useQuasar()
const tableRef = ref()

onMounted(async () => {
  tableRef.value.requestServerInteraction()
})


watch(table.search, () => {
  table.filter = String(Date.now())
}, {
  deep: true,
  immediate: true
})


watch(formField, (unsetError) => {
  for (let property in unsetError) {
    if (form[property]) {
      cost.unsetError(property)
    }
  }
}, {deep: true})

const onRequest = async (props) => {
  await cost.getTradingCostData(path, props)
}

const onSubmit = async () => {
  $q.dialog({
    title: form.edit ? 'Update data' : 'Simpan data',
    message: 'Apakah data yang di input sudah benar?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await cost.submitForm(path)
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

      if (property === 'trade_date') {
        form.trade_date = String(sel.trade_date).split(' ')[0]
      }
      if (property === 'edit') {
        form.edit = true
      }
    }

  })
}

const onDelete = async () => {
  $q.dialog({
    title: 'Hapus data',
    message: '<div class="text-red">Apakah anda yakin akan menghapus data ini?</div>',
    html: true,

    cancel: true,
    persistent: true
  }).onOk(() => {
    cost.submitDelete(path)
  })
}
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-card bordered>
      <q-card-section>
        <q-toolbar class="text-primary">
          <q-toolbar-title>
            Biaya Jual Beli Sawit
          </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-form
        @submit="onSubmit"
      >
        <q-card-section class="tw-space-y-4">

          <div class="md:tw-grid md:tw-grid-cols-3 md:tw-gap-4">
            <div class="lg:tw-col-span-1 tw-col-span-2">
              <div class="tw-space-x-2">
                <q-radio v-for="(type, i) in cost.cost_type" :key="i" v-model="form.category" :label="type.title"
                         :val="type.val"/>
              </div>
              <div class="tw-text-xs tw-text-red-700 tw-pl-4">{{ errors?.category }}</div>
              <q-field
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

              <q-number
                v-model="form.amount"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('amount')"
                :error-message="errors.amount"
                :options="page.currencyFormat"
                class="tw-w-full"
                filled
                label="Total Biaya (Rp)"
              />
              <q-input
                v-model="form.description"
                :dense="$q.screen.lt.md"
                :error="errors.hasOwnProperty('description')"
                :error-message="errors.description"
                autogrow
                filled
                label="Deskripsi pengeluaran"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="tw-flex justify-between tw-space-x-2">
          <q-btn
            v-if="can('app.biaya.biayaPembelianSawit.simpanPembelianSawit')"
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
            v-if="can('app.biaya.biayaPembelianSawit.hapusPembelianSawit')"
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
              Hapus transaksi yang terpilih
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="can('app.biaya.biayaPembelianSawit.ubahPembelianSawit')"
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
              Ubah data transaksi yang terpilih
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-form>
      <q-card-section class="no-padding">
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
          flat
          row-key="id"
          selection="single"
          @request="onRequest"
        >
          <template v-slot:top-row>
            <q-tr>
              <q-th></q-th>
              <q-th class="text-left">#</q-th>
              <q-th></q-th>
              <q-th>
                <q-select
                  v-model="table.search.category"
                  :options="cost.cost_type ?? []"
                  clearable
                  dense
                  label="Kategori"
                  emit-value
                  map-options
                  option-label="title"
                  option-value="value"
                />
              </q-th>
              <q-th>
                <q-input v-model="table.search.description" debounce="300" dense label="Deskripsi"/>
              </q-th>
              <q-th></q-th>
              <q-th></q-th>
            </q-tr>
          </template>
          <template v-slot:body-cell-no="props">
            <q-td>{{ props.rowIndex + 1 }}</q-td>
          </template>
          <template v-slot:body-cell-description="props">
            <q-td>
              <div class="tw-truncate tw-max-w-64">{{ props.row.description }}</div>
            </q-td>
          </template>
          <template v-slot:body-cell-amount="props">
            <q-td class="text-right">
              {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(props.value ?? 0)
              }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

