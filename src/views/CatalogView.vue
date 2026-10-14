<script setup>
import { computed,ref,watch } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { useCatalogStore } from '../stores/catalog.js'
import { filterProducts } from '../utils/catalog.js'
import ProductCard from '../components/product/ProductCard.vue'
import ProductFilters from '../components/product/ProductFilters.vue'
import LoadState from '../components/ui/LoadState.vue'
import { ChevronLeft,ChevronRight } from 'lucide-vue-next'
const catalog=useCatalogStore(),route=useRoute(),router=useRouter(),page=ref(1),perPage=9
const val = v=>Array.isArray(v)?String(v[0]??''):String(v??'')
const filters=computed(()=>({q:val(route.query.q),category:val(route.query.category),brand:val(route.query.brand),memory:val(route.query.memory),battery:val(route.query.battery),color:val(route.query.color),minPrice:val(route.query.minPrice),maxPrice:val(route.query.maxPrice),rating:val(route.query.rating),inStock:route.query.inStock==='1',sort:val(route.query.sort)||'rating'}))
const found=computed(()=>filterProducts(catalog.products,filters.value))
const visible=computed(()=>found.value.slice((page.value-1)*perPage,page.value*perPage))
const pages=computed(()=>Math.ceil(found.value.length/perPage))
watch(()=>route.query,()=>{page.value=1})
function update(patch){const q={...route.query,...patch};Object.keys(q).forEach(k=>{if(q[k]===''||q[k]===false||q[k]==null)delete q[k]});router.replace({name:'catalog',query:q})}
function go(n){if(n<1||n>pages.value)return;page.value=n;window.scrollTo({top:0,behavior:'smooth'})}
</script>
<template><div class="container catalog-page"><div class="catalog-layout"><ProductFilters :filters="filters" :categories="catalog.categories" :products="catalog.products" @change="update" @clear="router.replace({name:'catalog'})"/><div class="catalog-main"><div class="catalog-toolbar"><span>Selected Products: <strong>{{ found.length }}</strong></span><select :value="filters.sort" aria-label="Sort products" @change="update({sort:$event.target.value})"><option value="rating">By rating</option><option value="popular">By popularity</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">By name</option></select></div><LoadState v-if="catalog.loading||catalog.error" :loading="catalog.loading" :error="catalog.error" @retry="catalog.load(true)"/><template v-else-if="visible.length"><div class="products-grid catalog-products"><ProductCard v-for="p in visible" :key="p.id" :product="p"/></div><div v-if="pages>1" class="pagination"><button type="button" aria-label="Previous page" @click="go(page-1)"><ChevronLeft :size="20"/></button><button v-for="n in Math.min(pages,5)" :key="n" type="button" :class="{active:page===n}" @click="go(n)">{{ n }}</button><span v-if="pages>5">…</span><button v-if="pages>5" type="button" :class="{active:page===pages}" @click="go(pages)">{{ pages }}</button><button type="button" aria-label="Next page" @click="go(page+1)"><ChevronRight :size="20"/></button></div></template><p v-else class="no-products">Nothing found. Try another search or filter.</p></div></div></div></template>
