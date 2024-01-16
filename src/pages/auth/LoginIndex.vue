<script setup>
import {reactive} from "vue";
import {useAuthStore} from "stores/authStore";
import {useRoute, useRouter} from "vue-router";

const router = useRouter()
const auth = useAuthStore()
const {login, isError} = useAuthStore()
const {path, query} = useRoute()
const input = reactive({
  username: null,
  password: null,
  accept: false,
})
let errors = {}
const onSubmit = async () => {
  const toPath = query.to || '/app'
  login(path, input).then(() => {
    router.replace({path: toPath})
  })
}
const onReset = () => {
  errors = {}
}

</script>

<template>
  <q-page>
    <div class="tw-flex tw-justify-center tw-items-center tw-h-screen">
      <q-card flat square style="min-width: 420px">
        <q-img alt="Img" src="/undraw/mobile_login.svg"/>
        <q-form
          class="q-gutter-md"
          @reset="onReset"
          @submit.prevent="onSubmit"
        >
          <q-card-section>
            <q-input
              v-model="input.username"
              :error="isError('username')"
              :error-message="auth.errors.username"
              :rules="[ val => val && val.length > 0 || 'Please type something']"
              filled
              hint="Username"
              label="Username *"
              lazy-rules
            />

            <q-input
              v-model="input.password"
              :rules="[
          val => val !== null && val !== '' || 'Please type your password',
          val => val.length > 5 || 'Password must greater than 6 character'
        ]"
              filled
              label="Password *"
              lazy-rules
              type="password"
            />

            <q-checkbox v-model="input.accept" label="Remember me"/>

          </q-card-section>

          <q-separator dark/>

          <q-card-actions class="row justify-between">
            <q-btn color="warning" label="Reset" type="reset"/>
            <q-btn color="primary" label="Submit" type="submit"/>
          </q-card-actions>
          <q-card-actions>
            <q-btn color="dark" label="Home" to="/app" type="button"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </div>

  </q-page>
</template>

<style scoped>

</style>
