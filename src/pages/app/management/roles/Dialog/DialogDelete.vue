<script setup>
import {useRolesStore} from "stores/management/roles";
import {useRoute} from "vue-router";

const {path} = useRoute()
const {dialog, form, table} = useRolesStore()
const roles = useRolesStore()
const onSubmit = async () => {
  await roles.submitDelete(path)
}

</script>

<template>
  <q-dialog v-model="dialog.delete" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Yakin akan menghapus {{ form.delete_data.length > 1 ? form.delete_data.length : '' }} role
          ini?
        </div>
        <div class="text-red">Menghapus role akan mengakibatkan user yang memiliki role ini tidak memiliki akses ke menu aplikasi atau transaksi.</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-chip v-for="(name, i) in form.delete_data" :key="i">{{ name }}</q-chip>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-close-popup color="warning" flat label="Batalkan" type="reset"/>
        <q-space/>
        <q-btn :disable="table.loading"  color="primary" flat label="Hapus role" type="button" @click.prevent="onSubmit"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
