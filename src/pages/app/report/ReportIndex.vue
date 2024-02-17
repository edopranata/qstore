<script setup>
import {useAuthStore} from "stores/authStore";

const {can} = useAuthStore()
</script>

<template>
  <q-page class="tw-space-y-4" padding>
      <div class="tw-grid tw-grid-cols-3" v-if="can('app.laporan.dataLaporan.[hasilKebun,printHasilKebun,hasilLahan,printHasilLahan]')">
        <q-list bordered padding>
          <q-item-label header>Perkebunan</q-item-label>
          <q-item clickable v-ripple :to="{name: 'app.laporan.dataLaporan.hasilKebun'}" v-if="can('app.laporan.dataLaporan.[hasilKebun,printHasilKebun]')">
            <q-item-section>
              <q-item-label>Laporan Hasil perkebunan</q-item-label>
              <q-item-label caption lines="1">
                laporan hasil perkebunan berdasarkan periode (bulanan dan tahunan)
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{name: 'app.laporan.dataLaporan.hasilLahan'}" v-if="can('app.laporan.dataLaporan.[hasilLahan,printHasilLahan]')">
            <q-item-section>
              <q-item-label>Laoran hasil lahan</q-item-label>
              <q-item-label caption lines="1">
                Lihat laporan hasil panen kebun berdasarkan lokasi
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
  </q-page>
</template>

