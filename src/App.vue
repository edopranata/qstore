<template>
  <router-view/>
</template>

<script>
import {defineComponent} from 'vue'
import {LocalStorage} from 'quasar'
import {api} from 'boot/axios'
export default defineComponent({
  name: 'App',
  beforeCreate() {
    const token = LocalStorage.getItem('token')

    api.defaults.headers.common.Authorization = ''
    if(token)
      api.defaults.headers.common.Authorization = 'Bearer ' + token
  }
})
</script>

<script setup>

</script>
