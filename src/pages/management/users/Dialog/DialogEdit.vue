<script setup>
import {useUsersStore} from "stores/management/users";
import {useRoute} from "vue-router";

const {path} = useRoute()
const {dialog, form, onReset, table, submitEdit} = useUsersStore()
const onSubmit = async () => {
  await submitEdit(path)
}

</script>

<template>
  <q-dialog v-model="dialog.edit" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Edit User Baru</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset('edit')"
        @submit="onSubmit"
      >
        <q-card-section class="q-pt-none">
          <q-input
            readonly
            v-model="form.edit.username"
            label="Username login"
            lazy-rules
          />
          <q-input
            readonly
            v-model="form.edit.email"
            label="Alamat E-Mail"
            lazy-rules
          />
          <q-input
            v-model="form.edit.name"
            :rules="[ val => val && val.length > 3 || 'Nama lengkap minimal 3 huruf']"
            label="Nama Lengkap *"
            lazy-rules
          />
          <q-select
            v-model="form.edit.role"
            :options="table.roles"
            clearable
            label="Role User" />
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
