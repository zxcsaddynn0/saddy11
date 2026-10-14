<script setup>
import { computed } from 'vue'
import { Heart, ImageOff } from 'lucide-vue-next'
import FigmaIcon from '../ui/FigmaIcon.vue'
import { useFavoritesStore } from '../../stores/favorites.js'
import { useCartStore } from '../../stores/cart.js'
import { price, displayProductName } from '../../utils/catalog.js'
const props = defineProps({ product: { type:Object, required:true } })
const favorites = useFavoritesStore(), cart = useCartStore()
const saved = computed(() => favorites.has(props.product.id))
const name = computed(() => displayProductName(props.product))
</script>
<template><article class="product-card"><button type="button" class="card-heart" :class="{saved}" :aria-pressed="saved" :aria-label="saved?'Remove from favorites':'Add to favorites'" @click="favorites.toggle(product.id)"><Heart v-if="saved" :size="28" :stroke-width="1.5" fill="currentColor"/><FigmaIcon v-else name="like"/></button><RouterLink :to="`/product/${product.id}`" class="product-image-link"><img v-if="product.images[0]" :src="product.images[0]" :alt="product.name" loading="lazy"/><ImageOff v-else :size="48"/></RouterLink><RouterLink :to="`/product/${product.id}`" class="product-name">{{ name }}</RouterLink><strong class="card-price">{{ price(product.salePrice) }}</strong><button type="button" class="buy-button" :disabled="!product.available" @click="cart.add(product.id)">{{ product.available ? 'Buy Now' : 'Out of stock' }}</button></article></template>
