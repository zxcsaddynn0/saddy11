<script setup>
defineProps({ error: { type: String, default: '' }, loading: Boolean })
defineEmits(['retry'])
</script>
<template>
  <div v-if="loading" class="load-state" role="status"><span class="spinner"></span><span>Загружаем товары...</span></div>
  <div v-else-if="error" class="load-state error-state"><strong>Не получилось загрузить товары</strong><p>{{ error }}</p><p class="minor">Убедитесь, что сервер задания запущен: localhost:1452</p><button class="btn btn--primary" @click="$emit('retry')">Попробовать ещё раз</button></div>
</template>
