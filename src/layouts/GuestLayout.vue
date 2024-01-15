<template>
  <div>
    <q-layout view="hHh LpR lfr">
      <GuestHeader />
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>
<script setup>
import GuestHeader from "layouts/part/GuestHeader.vue";
</script>
