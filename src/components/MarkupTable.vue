<script setup>
defineProps({
  datatable: {
    type: Object
  }
})
</script>

<template>
  <q-markup-table>
    <thead>
    <tr>
      <th class="text-left" v-for="n in datatable.headers.length" :key="n">
        <q-skeleton animation="blink" type="text" />
      </th>

    </tr>
    </thead>

    <tbody>
    <tr v-for="r in datatable.pagination.rowsPerPage" :key="r">
      <td class="text-left" v-for="n in datatable.headers.length" :key="n">
        <q-skeleton animation="blink" type="text" width="85px" />
      </td>
    </tr>
    </tbody>
  </q-markup-table>
</template>

