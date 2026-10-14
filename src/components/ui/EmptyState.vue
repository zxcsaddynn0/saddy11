<script setup>
import { PackageOpen } from 'lucide-vue-next'
defineProps({ title: { type: String, default: 'Здесь пока пусто' }, text: { type: String, default: '' }, action: { type: String, default: '' }, to: { type: [String, Object], default: '/catalog' } })
</script>
<template><div class="empty-state"><div class="empty-illustration"><slot name="icon"><PackageOpen :size="42" :stroke-width="1.5" /></slot></div><h2>{{ title }}</h2><p v-if="text">{{ text }}</p><RouterLink v-if="action" :to="to" class="btn btn--primary">{{ action }}</RouterLink><slot /></div></template>
