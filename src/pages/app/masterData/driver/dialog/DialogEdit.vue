<script setup>
import {useDriversStore} from "stores/data/drivers";
import {useRoute} from "vue-router";

const {path} = useRoute()
const {dialog, form, onReset, table, submitForm, errors} = useDriversStore()


</script>

<template>
  <q-dialog v-model="dialog.edit" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Edit Driver</div>
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
            :rules="[ val => val && val.length > 3 || 'Nama supir minimal 3 huruf']"
            label="Nama Supir *"
            lazy-rules
          />
          <q-input
            :error="errors.hasOwnProperty('phone')"
            :error-message="errors.phone"
            v-model="form.phone"
            :rules="[ val => val && val.length <= 20 || 'No handphone maksimal 20 huruf']"
            label="No handphone *"
            lazy-rules
          />
          <q-input
            type="textarea"
            v-model="form.address"
            label="Alamat"
          />
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
