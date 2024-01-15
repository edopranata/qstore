<template>
  <q-layout view="hHh LpR lfr">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <MainHeader />
    </q-header>

    <q-drawer v-model="leftDrawer" side="left" bordered>
      <MainLeftSidebar />
    </q-drawer>

    <q-drawer v-model="rightDrawer" side="right" bordered>
      <MainRightSidebar />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <MainFooter />
    </q-footer>

  </q-layout>
</template>

<script setup>
import {usePageStore} from "stores/pageStore";

const {leftDrawer, rightDrawer} = storeToRefs(usePageStore())
import {storeToRefs} from "pinia";
import MainFooter from "layouts/part/MainFooter.vue";
import MainHeader from "layouts/part/MainHeader.vue";
import MainLeftSidebar from "layouts/part/MainLeftSidebar.vue";
import MainRightSidebar from "layouts/part/MainRightSidebar.vue";


</script>
