<script setup>
import {computed} from 'vue'
const props=defineProps({ name:{type:String,required:true} })
const entries={
  heart:['32px',47,0,32], cart:['32px',95,0,32], user:['32px',143,0,32], chevron:['32px',191,0,32], like:['32px',239,0,32],
  search:['24px',687,0,24], gaming:['48px',40,0,48], computers:['48px',96,0,48], phones:['48px',152,0,48],
  watches:['48px',208,0,48], cameras:['48px',264,0,48], headphones:['48px',320,0,48],
  twitter:['16px',82,0,16], facebook:['16px',150,0,16], tiktok:['16px',218,0,16], instagram:['16px',286,0,16],
  burger:['40px',40,0,40]
}
const info=computed(()=>entries[props.name]||entries.heart)
const style=computed(()=>({width:`${info.value[3]}px`,height:`${info.value[3]}px`,backgroundImage:`url('/design/icons/${info.value[0]}.svg')`,backgroundPosition:`-${info.value[1]}px ${info.value[2]}px`}))
</script>
<template><span class="figma-icon" :class="'figma-icon-'+name" :style="style" aria-hidden="true"></span></template>
