<script setup>
import {useAuthStore} from "stores/authStore";
import {usePageStore} from "stores/helper/pageStore";
import {reactive} from "vue";
import {storeToRefs} from "pinia";

const page = usePageStore()
const auth = useAuthStore()
const {user} = storeToRefs(useAuthStore())
const {errors} = storeToRefs(usePageStore())
const form = reactive({
  password: '',
  password_confirmation: '',
})
</script>

<template>
  <q-list bordered padding>
    <q-item-label header>User Info</q-item-label>
    <q-item>
      <q-item-section avatar>
        <q-avatar><q-icon name="person" size="lg"/>
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ user?.name }}</q-item-label>
        <q-item-label caption>{{ user?.username }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-separator spaced/>
    <q-item-label header>Change Password</q-item-label>

    <q-item>
      <q-item-section>
        <q-input standout v-model="form.password"  label="Current Password" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-input standout v-model="form.password_confirmation"  label="Confirmation Password" />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <q-btn color="primary" glossy label="Change Password" />
      </q-item-section>
    </q-item>

    <q-separator spaced/>
    <q-item-label header>Default Price</q-item-label>

    <q-item>
      <q-item-section>
        <q-number
          v-for="(property, prop) in page.setting" :key="`${prop}`"
          v-model="page.setting[prop]"
          :dense="$q.screen.lt.md"
          :error="errors.hasOwnProperty(prop)"
          :error-message="errors[prop]"
          :options="page.currencyFormat"
          class="tw-w-full"
          filled
          :data-value="property"
          :label="String(prop).replace('_', ' ').toLocaleUpperCase('id-ID')"
        />
      </q-item-section>
    </q-item>


  </q-list>
</template>
