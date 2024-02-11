<script setup>
import BlankRowPrint from "components/invoice/BlankRowPrint.vue";

defineProps({
  loan:{
    required: true
  }
})
</script>

<template>
  <div class="tw-grid tw-grid-cols-5">
    <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-font-bold tw-col-span-2">{{ loan.credit ? 'Potongan Pinjaman' : 'Pinjaman' }}:</span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-x"></span>
  </div>

  <div class="tw-grid tw-grid-cols-5">
    <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">Pinjaman terakhir:</span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-x text-right">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(loan.opening_balance ?? 0) }}</span>
  </div>

  <div class="tw-grid tw-grid-cols-5" v-if="loan.credit">
    <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">Angsuran:</span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-x text-right">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(loan.credit ?? 0) }}</span>
  </div>

  <div class="tw-grid tw-grid-cols-5" v-if="loan.debit">
    <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">Pinjaman:</span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-x text-right">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(loan.debit ?? 0) }}</span>
  </div>

  <div class="tw-grid tw-grid-cols-5">
    <span class="tw-px-4 tw-border-gray-800 tw-border-l tw-col-span-2">Sisa Pinjaman:</span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-l"></span>
    <span class="tw-px-4 tw-border-gray-800 tw-border-x text-right">{{ new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(loan.ending_balance ?? 0) }}</span>
  </div>

  <blank-row-print />
</template>

<style scoped>

</style>
