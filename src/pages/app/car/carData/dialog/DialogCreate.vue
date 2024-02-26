<script setup>
import {useCarsStore} from 'stores/data/car';
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const {path} = useRoute()
const {dialog, form, onReset, table, submitForm} = useCarsStore()
const {errors} = storeToRefs(useCarsStore())


</script>

<template>
  <q-dialog v-model="dialog.create" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Tambah data mobil</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset('create')"
        @submit="submitForm(path)"
      >
        <q-card-section class="q-pt-none">
          <q-select
            v-model="form.status"
            :error="errors.hasOwnProperty('status')"
            :error-message="errors.status"
            :options="table.car_status"
            :rules="[ val => !!val || 'Status kepemilikan diperlukan']"
            clearable
            dense
            emit-value
            label="Status Kepemilikan"
            map-options
            option-label="desc"
            option-value="id"
          />
          <q-input
            v-model="form.name"
            :error="errors.hasOwnProperty('name')"
            :error-message="errors.name"
            :rules="[ val => val && val.length > 3 || 'Merk mobil minimal 3 huruf']"
            label="Merk Mobil *"
            lazy-rules
          />
          <q-input
            :error="errors.hasOwnProperty('no_pol')"
            :error-message="errors.no_pol"
            v-model="form.no_pol"
            :rules="[ val => val && val.length < 12 || 'Plat no maksimal 11 huruf']"
            label="Plat nomor *"
            lazy-rules
          />
          <q-input
            type="textarea"
            v-model="form.description"
            label="Deskripsi"
          />
          <q-input
            type="number"
          v-model="form.year"
          clearable
          label="Tahun" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup color="warning" flat label="Batalkan" type="reset"/>
          <q-space/>
          <q-btn :disable="table.loading"  color="primary" flat label="Simpan" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
