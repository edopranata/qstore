<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <div class="tw-grid tw-grid-cols-3 tw-gap-4">
      <q-list v-if="can('app.laporan.dataLaporan.[hasilKebun,printHasilKebun,hasilLahan,printHasilLahan]')" bordered
              padding>
        <q-item-label header>Perkebunan</q-item-label>
        <q-item v-if="can('app.laporan.dataLaporan.[hasilKebun,printHasilKebun]')" v-ripple
                :to="{name: 'app.laporan.dataLaporan.hasilKebun'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Hasil perkebunan</q-item-label>
            <q-item-label caption lines="1">
              laporan hasil perkebunan berdasarkan periode (bulanan dan tahunan)
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="can('app.laporan.dataLaporan.[hasilLahan,printHasilLahan]')" v-ripple
                :to="{name: 'app.laporan.dataLaporan.hasilLahan'}"
                clickable>
          <q-item-section>
            <q-item-label>Laoran hasil lahan</q-item-label>
            <q-item-label caption lines="1">
              Lihat laporan hasil panen kebun berdasarkan lokasi
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list v-if="can('app.laporan.dataLaporan.[penghasilanMobil,penghasilanMobil]')" bordered padding>
        <q-item-label header>Mobil</q-item-label>
        <q-item v-ripple
                :to="{name: 'app.laporan.dataLaporan.penghasilanMobil'}"
                clickable>
          <q-item-section>
            <q-item-label>Laporan Penghasilan Mobil</q-item-label>
            <q-item-label caption lines="1">
              laporan pendapatan amprah mobil berdasarkan periode, bulanan dan tahunan
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-ripple
                :to="{name: 'app.laporan.dataLaporan.rekapPenghasilanMobil'}"
                clickable>
          <q-item-section>
            <q-item-label>Rekapitulasi pendapatan dan biaya Mobil</q-item-label>
            <q-item-label caption lines="1">
              laporan rekapitulasi pendapatan dan biaya mobil berdasarkan bulanan dan tahunan
            </q-item-label>
          </q-item-section>
        </q-item>

      </q-list>
    </div>
  </q-page>
</template>

