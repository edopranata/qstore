<template>
  <q-layout view="hHh LpR lfr">
    <q-header v-if="!print" class="bg-primary text-white print-hide" elevated height-hint="98">
      <MainHeader/>
    </q-header>

    <q-drawer v-if="!print" v-model="leftDrawer" bordered class="print-hide" side="left">
      <MainLeftSidebar/>
    </q-drawer>

    <q-drawer v-if="!print" v-model="rightDrawer" bordered class="print-hide" side="right">
      <MainRightSidebar/>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component, route }">
        <transition mode="out-in" name="slide-x">
          <component :is="Component" :key="route.name"/>
        </transition>
      </router-view>
    </q-page-container>

    <q-footer v-if="!print" class="bg-grey-8 text-white print-hide" elevated>
      <MainFooter/>
    </q-footer>

  </q-layout>
</template>

<script setup>
import {usePageStore} from "stores/helper/pageStore";
import {storeToRefs} from "pinia";
import MainFooter from "layouts/part/MainFooter.vue";
import MainHeader from "layouts/part/MainHeader.vue";
import MainLeftSidebar from "layouts/part/MainLeftSidebar.vue";
import MainRightSidebar from "layouts/part/MainRightSidebar.vue";

const {leftDrawer, rightDrawer, print} = storeToRefs(usePageStore())

</script>
