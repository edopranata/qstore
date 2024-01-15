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
    if(token){
      api.defaults.headers.common.Authorization = 'Bearer ' + token
    }else{
      api.defaults.headers.common.Authorization = ''
    }
  }
})
</script>

<script setup>

</script>
