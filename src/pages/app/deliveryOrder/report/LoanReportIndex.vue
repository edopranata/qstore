<script setup>
import {useDriverLoanReportStore} from "stores/report/car/driverLoanReport";
import {useAuthStore} from "stores/authStore";
import {storeToRefs} from "pinia";
import {onMounted} from "vue";
import {useRoute} from "vue-router";

const {can} = useAuthStore()
const {path} = useRoute()
const report = useDriverLoanReportStore()
const {table} = useDriverLoanReportStore()
const {errors} = storeToRefs(useDriverLoanReportStore())

onMounted(async () => {
  table.data = []
  await report.getReportData(path)
})

</script>

<template>
  <q-page class="tw-space-y-4" padding>
    <q-card>
      <q-card-section>

      </q-card-section>
      <q-card-section class="no-padding">
        <q-markup-table flat>
          <thead>
          <tr>
            <th class="text-left">No</th>
            <th class="text-left">Nama Pengepul</th>
            <th class="text-left">No Telp</th>
            <th class="text-right">Jumlah Pinjaman</th>
          </tr>
          </thead>
          <tbody v-if="table.data.length > 0">
          <tr v-for="( detail, i) in table.data" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ detail.name }}</td>
            <td>{{ detail.phone }}</td>
            <td class="text-right">
              {{
                new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(detail.balance)
              }}
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

