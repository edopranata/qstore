<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.deliveryOrder.laporan.[deliveryOrder,printdeliveryOrder,rekapitulasiDO,printRekapitulasiDO]')" bordered padding>
        <q-item-label header>Laporan Delivery Order</q-item-label>
        <q-item v-if="can('app.deliveryOrder.laporan.[deliveryOrder,printdeliveryOrder]')" v-ripple
                :to="{name: 'app.deliveryOrder.laporan.deliveryOrder'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Transaksi Delivery Order</q-item-label>
            <q-item-label caption lines="1">
              Laporan transaksi delivery order berdasarkan tahun, bulan atau periode
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can('app.deliveryOrder.laporan.[rekapitulasiDO,printRekapitulasiDO]')" v-ripple
                :to="{name: 'app.deliveryOrder.laporan.rekapitulasiDO'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Rekapitulasi Delivery Order</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi delivery order berdasarkan tahun, bulan
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-if="can('app.deliveryOrder.laporan.[pinjamanPengepul,printPinjamanPengepul]')" bordered padding>

        <q-item-label header>Pinjaman Pengepul</q-item-label>
        <q-item v-if="can('app.deliveryOrder.laporan.[pinjamanPengepul,printPinjamanPengepul]')" v-ripple
                :to="{name: 'app.deliveryOrder.laporan.printPinjamanPengepul'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan pinjaman pengepul</q-item-label>
            <q-item-label caption lines="1">
              Laporan jumlah sisa pinjaman pengepul
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can('app.deliveryOrder.laporan.[rekapPinjamanPengepul,printRekapPinjamanPengepul]')" v-ripple
                :to="{name: 'app.deliveryOrder.laporan.rekapPinjamanPengepul'}"
                clickable>
          <q-item-section>
            <q-item-label>Rekapitulasi pinjaman pengepul</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi angsuran dan pinjaman pengepul
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

