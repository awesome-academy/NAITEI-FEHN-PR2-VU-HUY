<template>
  <div class="rounded-lg p-4 text-white" :class="bgColor">
    <div class="flex justify-between items-start">
      <div>
        <h2 class="text-3xl font-bold">{{ value }}</h2>
        <p class="text-sm font-semibold opacity-80">{{ label }}</p>
      </div>
      <div class="flex items-center p-1 bg-white bg-opacity-20 rounded-full">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  value: String,
  bgColor: String,
  changeClass: {
    type: String,
    default: 'text-white'
  }
});
</script>
