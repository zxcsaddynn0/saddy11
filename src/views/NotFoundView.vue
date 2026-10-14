<script setup>
import { ArrowLeft } from 'lucide-vue-next'
</script>
<template><div class="container not-found"><span>404</span><h1>Страница не найдена</h1><p>Похоже, такой страницы у нас нет. Но в каталоге есть много интересного.</p><RouterLink to="/" class="btn btn--primary"><ArrowLeft :size="18" /> На главную</RouterLink></div></template>
