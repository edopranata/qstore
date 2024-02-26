<script setup>
import {useInvoiceTradingStore} from "stores/invoice/invoiceTrading";
import {usePageStore} from "stores/helper/pageStore";
import {useAuthStore} from "stores/authStore";
import {onMounted} from "vue";
import {useRoute} from "vue-router";
import InvoiceTradingDetails from "pages/app/invoice/Trading/InvoiceTradingDetails.vue";

const {can} = useAuthStore()
const page = usePageStore()
const trading = useInvoiceTradingStore()
const {table} = useInvoiceTradingStore()
const {path} = useRoute()

onMounted(async () => {
  await trading.getCustomerTrade(path)
})



</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-card>
      <q-table
        :columns="table.headers ?? []"
        :dense="$q.screen.lt.md"
        :loading="table.loading"
        :rows="table.data ?? []"
        binary-state-sort
        bordered
        flat
        row-key="id"
      >
        <template v-slot:top>
          <q-toolbar class="text-primary">
            <q-toolbar-title>
              Data invoice petani yang belum di cairkan
            </q-toolbar-title>
          </q-toolbar>
        </template>

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th>Details</q-th>
            <q-th class="text-left">Invoice</q-th>
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
            <q-td auto-width>
              <q-btn :icon="props.expand ? 'remove' : 'add'" color="accent" dense round size="sm"
                     @click="props.expand = !props.expand"/>
            </q-td>
            <q-td>
              <q-btn
                :dense="$q.screen.lt.lg"
                :label="!$q.screen.lt.md ? 'Buat Invoice' : ''"
                :loading="table.loading"
                :round="$q.screen.lt.md"
                glossy
                icon="print"
                size="sm"
                :to="{name: 'app.jualBeliSawit.buatInvoicePetani.details', params: {id: props.row.id}}"
              >
                <q-tooltip>
                  Buat invoice petani
                </q-tooltip>
              </q-btn>
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
    </q-card>
  </q-page>
</template>

