<script setup>
import { computed,ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import FigmaIcon from '../components/ui/FigmaIcon.vue'
import { useCatalogStore } from '../stores/catalog.js'
import ProductCard from '../components/product/ProductCard.vue'
import LoadState from '../components/ui/LoadState.vue'
const catalog=useCatalogStore(),router=useRouter(),selectedTab=ref('New Arrival'), categoryShift=ref(0)
const tabs=['New Arrival','Bestseller','Featured Products']
const homePreferred = [/iphone.*(15 pro max|13 pro max|14 pro max)/i, /camera|blackmagic|камер/i,
  /apple watch|watch series/i, /airpods max/i, /samsung.*watch|galaxy watch/i,
  /galaxy.*fold|z fold/i, /buds|наушник/i, /ipad/i]
const collection=computed(()=>{
  const available=catalog.products.filter(p=>p.available)
  const selected=[]
  for (const expression of homePreferred) {
    const match=available.find(p=>expression.test(`${p.name} ${p.category}`) && !selected.some(q=>q.id===p.id))
    if(match)selected.push(match)
  }
  return [...selected, ...available.filter(p=>!selected.some(q=>q.id===p.id))].slice(0,8)
})
const featured=computed(()=>{
  if(selectedTab.value==='New Arrival')return collection.value
  const items=[...catalog.products].filter(p=>p.available)
  if(selectedTab.value==='Bestseller')items.sort((a,b)=>b.reviewCount-a.reviewCount)
  else items.sort((a,b)=>b.rating-a.rating||b.reviewCount-a.reviewCount)
  return items.slice(0,8)
})
const discounts=computed(()=>{
  const available=catalog.products.filter(p=>p.available)
  const ids=[]
  for(const pattern of [/iphone.*pro/i,/airpods max/i,/apple watch|watch series/i,/iphone/i]) {
    const match=available.find(p=>pattern.test(p.name) && !ids.some(q=>q.id===p.id))
    if(match)ids.push(match)
  }
  return [...ids,...available.filter(p=>!ids.some(q=>q.id===p.id))].slice(0,4)
})
const categories=[{name:'Phones',icon:'phones',match:'iphone'},{name:'Smart Watches',icon:'watches',match:'watch'},{name:'Cameras',icon:'cameras',match:'camera'},{name:'Headphones',icon:'headphones',match:'airpods'},{name:'Computers',icon:'computers',match:'imac'},{name:'Gaming',icon:'gaming',match:'game'}]
const visibleCategories=computed(()=>[...categories.slice(categoryShift.value),...categories.slice(0,categoryShift.value)])
function shiftCategories(direction){categoryShift.value=(categoryShift.value+direction+categories.length)%categories.length}
function openCategory(item){router.push({name:'catalog',query:{q:item.match}})}
</script>
<template><div class="home-page"><section class="hero"><div class="container hero-inner"><div class="hero-copy"><span>Pro.Beyond.</span><h1>IPhone 14 <b>Pro</b></h1><p>Created to change everything for the better. For everyone</p><RouterLink to="/catalog" class="hero-outline">Shop Now</RouterLink></div><div class="hero-art" aria-label="iPhone 14 Pro"><img src="/design/original/hero-iphone.png" alt="iPhone 14 Pro" class="hero-illustration"/></div></div></section>
<section class="mosaic"><div class="mosaic-left"><div class="mosaic-playstation"><img src="/design/original/playstation.png" alt="Technology"/><div><h2>Playstation <b>5</b></h2><p>Incredibly powerful CPUs, GPUs, and an SSD with integrated I/O will redefine your PlayStation experience.</p></div></div><div class="mosaic-lower"><div class="mosaic-airpods"><img src="/design/original/airpods-max.png" alt="AirPods Max"/><div><h3>Apple AirPods <b>Max</b></h3><p>Computational audio. Listen, it's powerful.</p></div></div><div class="mosaic-vision"><img src="/design/original/vision-pro.png" alt="Technology"/><div><h3>Apple Vision <b>Pro</b></h3><p>An immersive way to experience entertainment</p></div></div></div></div><div class="mosaic-mac"><div><h2>Macbook <b>Air</b></h2><p>The new 15-inch MacBook Air makes room for more of what you love with a spacious Liquid Retina display.</p><RouterLink to="/catalog" class="outline-button">Shop Now</RouterLink></div><img src="/design/macbook-air.png" alt="Computer"/></div></section>
<section class="category-section"><div class="container"><div class="category-heading"><h2>Browse By Category</h2><div><button type="button" aria-label="Previous categories" @click="shiftCategories(-1)"><ChevronLeft :size="24"/></button><button type="button" aria-label="Next categories" @click="shiftCategories(1)"><ChevronRight :size="24"/></button></div></div><div class="category-grid"><button v-for="item in visibleCategories" :key="item.name" type="button" @click="openCategory(item)" class="category-tile"><FigmaIcon :name="item.icon"/><span>{{ item.name }}</span></button></div></div></section>
<section class="container home-products"><div class="tabs" role="tablist" aria-label="Product collections"><button v-for="tab in tabs" :key="tab" role="tab" :aria-selected="selectedTab===tab" type="button" :class="{selected:selectedTab===tab}" @click="selectedTab=tab">{{ tab }}</button></div><LoadState v-if="catalog.loading||catalog.error" :loading="catalog.loading" :error="catalog.error" @retry="catalog.load(true)"/><div v-else class="products-grid"><ProductCard v-for="p in featured" :key="p.id" :product="p"/></div></section>
<section class="four-promo"><article class="promo-card promo-first"><img src="/design/popular-products.png" alt="Wearables"/><h2>Popular Products</h2><p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p><RouterLink to="/catalog" class="outline-button">Shop Now</RouterLink></article><article class="promo-card promo-second"><img src="/design/original/ipad-pro.png" alt="iPad"/><h2>Ipad Pro</h2><p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p><RouterLink to="/catalog" class="outline-button">Shop Now</RouterLink></article><article class="promo-card promo-third"><img src="/design/original/galaxy-fold.png" alt="Samsung Galaxy"/><h2>Samsung Galaxy</h2><p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p><RouterLink to="/catalog" class="outline-button">Shop Now</RouterLink></article><article class="promo-card promo-fourth"><img src="/design/original/macbook-pro.png" alt="Macbook"/><h2>Macbook Pro</h2><p>iPad combines a magnificent 10.2-inch Retina display, incredible performance, multitasking and ease of use.</p><RouterLink to="/catalog" class="outline-button outline-light">Shop Now</RouterLink></article></section>
<section class="container discount-section"><h2>Discounts up to -50%</h2><div class="products-grid"><ProductCard v-for="p in discounts" :key="p.id" :product="p"/></div></section>
<section class="summer-banner"><div class="summer-graphics" aria-hidden="true"><img class="summer-tablet" src="/design/original/summer-tablet.png" alt=""/><img class="summer-macbook" src="/design/original/summer-macbook.png" alt=""/><img class="summer-ipad" src="/design/original/summer-ipad.png" alt=""/><img class="summer-iphone" src="/design/original/summer-iphone.png" alt=""/><img class="summer-watch" src="/design/original/summer-watch.png" alt=""/></div><div class="summer-copy"><h2>Big Summer <b>Sale</b></h2><p>Commodo fames vitae vitae leo mauris in. Eu consequat.</p><RouterLink to="/catalog" class="hero-outline">Shop Now</RouterLink></div></section></div></template>
