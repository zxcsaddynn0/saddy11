<script setup>
import { computed } from 'vue'
const props = defineProps({ variant: { type: String, default: 'primary' }, size: { type: String, default: 'md' }, disabled: Boolean, type: { type: String, default: 'button' }, block: Boolean })
const classes = computed(() => ['btn', `btn--${props.variant}`, `btn--${props.size}`, { 'btn--block': props.block }])
</script>
<template><button :type="type" :disabled="disabled" :class="classes"><slot /></button></template>
