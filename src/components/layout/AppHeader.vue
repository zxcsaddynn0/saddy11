<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import FigmaIcon from '../ui/FigmaIcon.vue'
import { useCartStore } from '../../stores/cart.js'
import { useFavoritesStore } from '../../stores/favorites.js'
const route = useRoute(), router = useRouter(), cart = useCartStore(), favorites = useFavoritesStore()
const search = ref(String(route.query.q || '')), menuOpen = ref(false)
watch(() => route.query.q, q => { search.value = String(q || '') })
watch(() => route.fullPath, () => { menuOpen.value = false })
function submitSearch() { router.push({name:'catalog',query:search.value.trim()?{q:search.value.trim()}:{} }); menuOpen.value = false }
</script>
<template>
<header class="site-header">
  <div class="site-header-inner container">
    <RouterLink to="/" class="brand" aria-label="cyber, home"><img src="/design/cyber-logo.svg" width="96" height="29" alt="cyber"/></RouterLink>
    <form class="search-bar" @submit.prevent="submitSearch" role="search"><FigmaIcon name="search"/><input v-model="search" type="search" placeholder="Search" aria-label="Search products"/><button type="submit" class="visually-hidden">Search</button></form>
    <div class="header-actions">
      <RouterLink to="/favorites" class="header-icon" aria-label="Favorite"><FigmaIcon name="heart"/><sup v-if="favorites.count">{{ favorites.count }}</sup></RouterLink>
      <RouterLink to="/cart" class="header-icon" aria-label="Shopping Cart"><FigmaIcon name="cart"/><sup v-if="cart.count">{{ cart.count }}</sup></RouterLink>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" @click="menuOpen=!menuOpen" aria-label="Open menu"><X v-if="menuOpen" :size="34"/><FigmaIcon v-else name="burger"/></button>
    </div>
  </div>
  <nav v-if="menuOpen" class="mobile-nav" aria-label="Navigation"><form class="mobile-search" @submit.prevent="submitSearch" role="search"><input v-model="search" type="search" placeholder="Search products" aria-label="Search products"/><button type="submit">Search</button></form><RouterLink to="/">Home</RouterLink><RouterLink to="/catalog">Catalog</RouterLink><RouterLink to="/favorites">Favorite ({{ favorites.count }})</RouterLink><RouterLink to="/cart">Shopping Cart ({{ cart.count }})</RouterLink></nav>
</header>
</template>
