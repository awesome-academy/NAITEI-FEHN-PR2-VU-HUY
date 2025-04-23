<template>
  <label class="flex items-center gap-3 cursor-pointer select-none text-white">
    <div
      :class="[
        'w-4 h-4 border-2 rotate-45 flex items-center justify-center',
        modelValue ? 'bg-blue-400 border-blue-400' : 'bg-gray-900'
      ]"
    >
      <div
        v-if="modelValue"
        class="w-10 -rotate-45 text-white flex items-center justify-center"
      >
        <Icon name="iconamoon:check-bold" size="16px" />
      </div>
    </div>
    <span>{{ label }}</span>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      class="hidden"
    />
  </label>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  label: String,
})

defineEmits(['update:modelValue']) 
</script>
