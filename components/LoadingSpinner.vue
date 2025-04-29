<template>
  <div class="flex items-center justify-center">
    <div 
      :class="[
        'spinner border-t-transparent rounded-full animate-spin',
        `w-${size} h-${size}`,
        `border-${borderWidth}`,
        `border-${color}`
      ]"
      role="status"
      aria-label="Loading"
    ></div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: '12'
  },
  color: {
    type: String,
    default: 'blue-600'
  },
  borderWidth: {
    type: String,
    default: '4'
  }
});
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
</style>
