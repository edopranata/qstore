<script setup>
import {useCustomersStore} from "stores/data/customer";
import {useRoute} from "vue-router";
import {storeToRefs} from "pinia";

const {path} = useRoute()
const {dialog, form, onReset, table, submitForm} = useCustomersStore()
const {errors} = storeToRefs(useCustomersStore())


</script>

<template>
  <q-dialog v-model="dialog.edit" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Edit data petani</div>
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
            :rules="[ val => val && val.length > 4 || 'Customer name must be greater than 3 characters.']"
            label="Customer Name *"
            lazy-rules
          />
          <div class="tw-flex tw-space-x-4">
            <q-input
              v-model="form.phone"
              :error="errors.hasOwnProperty('phone')"
              :error-message="errors.phone"
              :rules="[ val => val && val.length <= 20 || 'Phone number must be lower than 20 characters.']"
              class="tw-w-full"
              label="Phone Number *"
              lazy-rules
            />

            <q-input
              v-model="form.distance"
              class="tw-max-w-4xl"
              input-class="text-right"
              label="Distance"
              mask="#"
              reverse-fill-mask
              suffix="Km"
            />
          </div>
          <q-input
            v-model="form.address"
            label="Address"
            type="textarea"
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

<style scoped>

</style>
