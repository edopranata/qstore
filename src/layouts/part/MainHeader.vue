<script setup>
import {usePageStore} from "stores/helper/pageStore";

const {toggleLeftDrawer, toggleRightDrawer} = usePageStore()
</script>

<template>
  <q-toolbar class="glossy">
    <q-btn flat round icon="menu" @click="toggleLeftDrawer" />
    <q-btn outline round label="mms" to="/app" class="tw-ml-2" />
    <q-toolbar-title>MAY MAY</q-toolbar-title>

    <q-btn dense flat icon="manage_accounts" round @click="toggleRightDrawer"/>
  </q-toolbar>
</template>

