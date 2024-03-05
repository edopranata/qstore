<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.mobil.laporan.[penghasilanMobil,printPenghasilanMobil,rekapPenghasilanMobil,printRekapPenghasilanMobil]')" bordered padding>
        <q-item-label header>Rekap Penghasilan Mobil</q-item-label>
        <q-item v-if="can('app.mobil.laporan.penghasilanMobil.[penghasilanMobil,printPenghasilanMobil]')" v-ripple
                :to="{name: 'app.perkebunan.laporan.penghasilanMobil'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan penghasilan mobil</q-item-label>
            <q-item-label caption lines="1">
              Laporan transaksi pendapatan mobil
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can('app.mobil.laporan.[rekapPenghasilanMobil,printRekapPenghasilanMobil]')" v-ripple
                :to="{name: 'app.mobil.laporan.rekapPenghasilanMobil'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Rekapitulasi Penghasilan Mobil</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi penghasilan mobil berdasarkan tahun, bulan
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </div>
  </q-page>
</template>

