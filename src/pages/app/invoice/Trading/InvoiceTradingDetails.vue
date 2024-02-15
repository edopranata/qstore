<script setup>
defineProps({
  details: Array
})
</script>

<template>
  <q-markup-table dense class="tw-max-w-3xl">
    <thead>
    <q-tr>
      <q-th auto-width>No</q-th>
      <q-th class="text-left">Tanggal Transaksi</q-th>
      <q-th class="text-right">Tonase</q-th>
      <q-th class="text-right">Harga</q-th>
      <q-th class="text-right">Total</q-th>
    </q-tr>
    </thead>
    <tbody>
    <q-tr v-for="(detail, i) in details" :key="i">
      <q-td>{{ i + 1 }}</q-td>
      <q-td>{{ detail.trade_date }}</q-td>
      <q-td class="text-right">{{ Intl.NumberFormat('id-ID', {style: 'unit', unit: 'kilogram'}).format(detail.weight??0) }}</q-td>
      <q-td class="text-right">{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 2}).format(detail.price??0) }}</q-td>
      <q-td class="text-right">{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR', minimumFractionDigits: 2}).format(detail.total??0) }}</q-td>
    </q-tr>
    </tbody>
  </q-markup-table>
</template>

