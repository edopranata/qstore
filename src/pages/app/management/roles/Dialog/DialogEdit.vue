<script setup>
import {useRolesStore} from "stores/management/roles";
import {useRoute} from "vue-router";

const {path} = useRoute()
const {dialog, form, onReset, table} = useRolesStore()
const roles = useRolesStore()
const onSubmit = async () => {
  await roles.submitEdit(path)
}

</script>

<template>
  <q-dialog v-model="dialog.edit" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Edit Role</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset('edit')"
        @submit="onSubmit"
      >
        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.edit.name"
            :rules="[ val => val && val.length > 3 || 'Penamaan role belum lengkap, minimal 4 huruf']"
            label="Role Name"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup color="warning" flat label="Batalkan" type="reset"/>
          <q-space/>
          <q-btn :disable="table.loading" color="primary" flat label="Ubah Data" type="submit"/>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
