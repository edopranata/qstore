<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.perkebunan.laporan.[perkebunan,printPerkebunan,rekapituliasiPerkebunan,printRekapituliasiPerkebunan]')" bordered padding>
        <q-item-label header>Laporan Hasil Kebun</q-item-label>
        <q-item v-if="can('app.perkebunan.laporan.[perkebunan,printPerkebunan]')" v-ripple
                :to="{name: 'app.perkebunan.laporan.perkebunan'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Transaksi Delivery Order</q-item-label>
            <q-item-label caption lines="1">
              Laporan transaksi penjualan hasil perkebunan, bulan atau periode
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can('app.perkebunan.laporan.[rekapituliasiPerkebunan,printRekapituliasiPerkebunan]')" v-ripple
                :to="{name: 'app.perkebunan.laporan.rekapituliasiPerkebunan'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Rekapitulasi Delivery Order</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi delivery order berdasarkan tahun, bulan
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </div>
  </q-page>
</template>

