<script setup>
import { onMounted } from 'vue'
import { useCatalogStore } from './stores/catalog.js'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
const catalog = useCatalogStore()
onMounted(() => catalog.load())
</script>
<template>
  <div class="app-shell">
    <AppHeader />
    <main id="main"><RouterView /></main>
    <AppFooter />
  </div>
</template>
