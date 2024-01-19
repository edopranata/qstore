<script setup>
import {usePageStore} from "stores/pageStore";
const {toggleLeftDrawer, toggleRightDrawer} = usePageStore()
</script>

<template>
  <q-toolbar class="glossy">
    <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

    <q-toolbar-title>
      <q-avatar>
        <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" alt="img">
      </q-avatar>
      Title
    </q-toolbar-title>

    <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
  </q-toolbar>
</template>

