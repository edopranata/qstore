<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.mobil.laporan.[penghasilanMobil,printPenghasilanMobil,rekapPenghasilanMobil,printRekapPenghasilanMobil]')" bordered padding>
        <q-item-label header>Penghasilan Mobil</q-item-label>
        <q-item v-if="can('app.mobil.laporan.[penghasilanMobil,printPenghasilanMobil]')" v-ripple
                :to="{name: 'app.mobil.laporan.penghasilanMobil'}"
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

      <q-list v-if="can('app.mobil.laporan.[pinjamanSupir,printPinjamanSupir]')" bordered padding>

        <q-item-label header>Pinjaman Supir</q-item-label>
        <q-item v-if="can('app.mobil.laporan.[pinjamanSupir,printPinjamanSupir]')" v-ripple
                :to="{name: 'app.mobil.laporan.printPinjamanSupir'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan pinjaman supir</q-item-label>
            <q-item-label caption lines="1">
              Laporan jumlah sisa pinjaman supir
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="can('app.mobil.laporan.[rekapPinjamanSupir,printRekapPinjamanSupir]')" v-ripple
                :to="{name: 'app.mobil.laporan.rekapPinjamanSupir'}"
                clickable>
          <q-item-section>
            <q-item-label>Rekapitulasi pinjaman supir</q-item-label>
            <q-item-label caption lines="1">
              Laporan rekapitulasi angsuran dan pinjaman supir
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

