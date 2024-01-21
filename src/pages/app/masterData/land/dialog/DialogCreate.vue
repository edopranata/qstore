<script setup>
import {useLandsStore} from 'stores/data/land';
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const {path} = useRoute()
const {dialog, form, onReset, table, submitForm} = useLandsStore()
const {errors} = storeToRefs(useLandsStore())


</script>

<template>
  <q-dialog v-model="dialog.create" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Create new</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset('create')"
        @submit="submitForm(path)"
      >
        <q-card-section class="q-pt-none">
          <q-select
            v-model="form.area_id"
            :loading="table.loading"
            :options="table.areas"
            clearable
            emit-value
            fill-input
            label="Area"
            map-options
            option-label="name"
            option-value="id"/>
          <q-input
            v-model="form.name"
            :error="errors.hasOwnProperty('name')"
            :error-message="errors.name"
            :rules="[ val => val && val.length > 3 || 'Nama area minimal 3 huruf']"
            label="Nama Lahan *"
            lazy-rules
          />
          <div class="tw-flex tw-space-x-4">

            <q-input
              v-model="form.wide"
              :error="errors.hasOwnProperty('wide')"
              :error-message="errors.wide"
              :rules="[ val => val && val > 0 || 'Luas lahan minimal 1 Ha']"
              class="tw-w-1/2"
              label="Luas Lahan (Ha) *"
              lazy-rules
              mask="#"
              reverse-fill-mask
              suffix="Ha"
            />
            <q-input
              v-model="form.trees"
              :error="errors.hasOwnProperty('trees')"
              :error-message="errors.trees"
              :rules="[ val => val && val > 10 || 'Jumlah Pohon harus lebih besar dari 10']"
              class="tw-w-1/2"
              label="Jumlah Pohon (Btg) *"
              lazy-rules
              mask="#"
              reverse-fill-mask
              suffix="Btg"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup color="warning" flat label="Batalkan" type="reset"/>
          <q-space/>
          <q-btn :disable="table.loading" color="primary" flat label="Simpan" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
