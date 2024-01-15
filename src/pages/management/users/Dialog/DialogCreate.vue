<script setup>
import {useUsersStore} from "stores/management/users";
import {useRoute} from "vue-router";

const {path} = useRoute()
const {dialog, form, onReset, table, submitCreate} = useUsersStore()
const onSubmit = async () => {
  console.log(path)
  await submitCreate(path)
}

</script>

<template>
  <q-dialog v-model="dialog.create" persistent transition-hide="scale" transition-show="scale">
    <q-card style="width: 600px;">
      <q-card-section>
        <div class="text-h6">Ubah Password User</div>
      </q-card-section>

      <q-form
        class="q-gutter-md"
        @reset="onReset('create')"
        @submit="onSubmit"
      >
        <q-card-section class="q-pt-none">
          <q-input
            v-model="form.create.name"
            :rules="[ val => val && val.length > 3 || 'Nama lengkap minimal 3 huruf']"
            label="Nama Lengkap *"
            lazy-rules
          />
          <q-input
            v-model="form.create.username"
            :rules="[ val => val && val.length > 5 || 'Username minimal 6 huruf']"
            label="Username login *"
            lazy-rules
          />
          <q-input
            v-model="form.create.email"
            :rules="[
              (val) => !!val || 'E-mail wajib di isi',
              (val) => !val || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val) || 'Format penulisan E-Mail salah'
            ]"
            label="Alamat E-Mail *"
            lazy-rules
          />
          <q-select
          v-model="form.create.role"
          :options="table.roles"
          :rules="[
            (val) => !!val || 'Pilih salah satu role untuk user',
          ]"
          clearable
          label="Role User" />
          <q-input
            v-model="form.create.password"
            :rules="[ val => val && val.length > 5 || 'Password minimal 6 huruf']"
            label="Kata sandi *"
            lazy-rules
            type="password"
          />

          <q-input
            v-model="form.create.password_confirmation"
            :rules="[
                (val) => !!val || 'Kata sandi konfirmasi tidak boleh kosong',
          (val) => val === form.create.password || 'Konfirmasi kata sandi tidak cocok.'
            ]"
            label="Konfirmasi kata sandi *"
            lazy-rules
            type="password"
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
