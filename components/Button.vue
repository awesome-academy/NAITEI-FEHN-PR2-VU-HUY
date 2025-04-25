<script setup>
defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  clipPathSize: {
    type: String,
    default: '16px'
  }
})
</script>


<template>
  <button
    :class="[
      'relative w-full text-white text-center px-6 py-2 font-medium clip-button',
      disabled
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.clip-button {
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - v-bind(clipPathSize)), calc(100% - v-bind(clipPathSize)) 100%, 0% 100%);
}
</style>
