<script setup>
import { computed } from 'vue'
import { useFavoritesStore } from '../stores/favorites.js'
import { useCatalogStore } from '../stores/catalog.js'
import { displayProductName } from '../utils/catalog.js'
import LoadState from '../components/ui/LoadState.vue'
const favorites=useFavoritesStore(), catalog=useCatalogStore()
const products=computed(()=>favorites.ids.map(id=>catalog.byId(id)).filter(Boolean))
</script>
<template><section class="favorites-section"><div class="favorite-list"><h1>Favorite</h1><LoadState v-if="catalog.loading||catalog.error" :loading="catalog.loading" :error="catalog.error" @retry="catalog.load(true)"/><p v-else-if="!products.length" class="favorite-empty">Your favorites list is empty. <RouterLink to="/catalog">Browse products</RouterLink></p><div v-for="p in products" :key="p.id" class="favorite-row"><RouterLink :to="`/product/${p.id}`"><img v-if="p.images[0]" :src="p.images[0]" :alt="p.name"/></RouterLink><div><RouterLink :to="`/product/${p.id}`">{{ displayProductName(p) }}</RouterLink><span>#{{ p.id }}</span><button type="button" @click="favorites.toggle(p.id)">Remove</button></div></div></div></section></template>
