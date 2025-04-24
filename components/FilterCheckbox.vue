<!-- FilterCheckbox.vue -->
<template>
  <div class="flex items-center gap-3">
    <div 
      class="rhombus-checkbox cursor-pointer" 
      :class="{ 'selected': modelValue }" 
      @click="$emit('update:modelValue', !modelValue)"
    >
      <div v-if="modelValue" class="inner-rhombus"></div>
    </div>
    <span class="text-white text-base">{{ label }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.rhombus-checkbox {
  width: 24px;
  height: 24px;
  transform: rotate(45deg);
  border: 2px solid #fff;
  position: relative;
}

.selected {
  border-color: #3b82f6;
}

.inner-rhombus {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 12px;
  height: 12px;
  background-color: #3b82f6;
}
</style>
