<script setup>
import {usePageStore} from "stores/pageStore";
import {onBeforeMount} from "vue";
import {storeToRefs} from "pinia";
import {LocalStorage} from "quasar";

const {menus, setActive} = usePageStore()
const page = usePageStore()
const {activeMenu} =storeToRefs(usePageStore())

onBeforeMount( async () => {
  const active = LocalStorage.getItem('active') ?? ''
  page.setActive(active)
})
</script>

<template>

  <q-card flat square>
    <q-img alt="Img" src="https://cdn.quasar.dev/img/parallax2.jpg"/>
    <q-list bordered class="rounded-borders">
      <q-item
        v-ripple
        clickable
        to="/app">
        <q-item-section avatar>
          <q-icon name="home"/>
        </q-item-section>

        <q-item-section>Dashboard</q-item-section>
      </q-item>

      <q-expansion-item
        v-for="(menu, m) in menus"
        :key="m"
        :content-inset-level="1"
        :default-opened="activeMenu.startsWith(menu.name)"
        :icon="menu.icon ?? 'double_arrow'"
        :label="menu.title"
        expand-separator
      >
        <q-list v-if="menu.children.length > 0" padding>
          <q-item
            v-for="(child, c) in menu.children"
            :key="c"
            v-ripple
            :active="activeMenu === child.name"
            :to="child.path"
            clickable
            @click="setActive(child.name)">
            <q-item-section>
              {{ child.title }}
            </q-item-section>
          </q-item>

        </q-list>
      </q-expansion-item>

    </q-list>
  </q-card>

</template>
