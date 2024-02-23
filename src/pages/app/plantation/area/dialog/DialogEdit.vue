<script setup>
import {useAreasStore} from 'stores/data/area';
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const {path} = useRoute()
const {dialog, form, onReset, table, submitForm} = useAreasStore()
const {errors} = storeToRefs(useAreasStore())


</script>

<template>
  <q-dialog v-model="dialog.edit" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Edit Area</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset()"
        @submit="submitForm(path)"
      >
        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.name"
            :error="errors.hasOwnProperty('name')"
            :error-message="errors.name"
            :rules="[ val => val && val.length > 3 || 'Nama area minimal 3 huruf']"
            label="Nama Area *"
            lazy-rules
          />
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

