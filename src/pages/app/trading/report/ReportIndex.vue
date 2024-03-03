<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.jualBeliSawit.laporan.[jualBeliSawit,printJualBeliSawit,rekapituliasiJualBeliSawit,printRekapituliasiJualBeliSawit]')" bordered padding>
        <q-item-label header>Laporan Jual Beli Sawit</q-item-label>
        <q-item v-if="can('app.jualBeliSawit.laporan.[jualBeliSawit,printJualBeliSawit]')" v-ripple
                :to="{name: 'app.jualBeliSawit.laporan.jualBeliSawit'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Transaksi Jual Beli Sawit</q-item-label>
            <q-item-label caption lines="1">
              Laporan transaksi jual beli sawit berdasarkan tahun, bulan atau periode
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can('app.jualBeliSawit.laporan.[rekapituliasiJualBeliSawit,printRekapituliasiJualBeliSawit]')" v-ripple
                :to="{name: 'app.jualBeliSawit.laporan.rekapituliasiJualBeliSawit'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Rekapitulasi Jual Beli Sawit</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi jual beli sawit berdasarkan tahun, bulan
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </div>
  </q-page>
</template>

