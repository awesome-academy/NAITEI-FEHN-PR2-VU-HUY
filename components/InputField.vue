<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm text-gray-300">{{ label }}</label>
    <div class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        required
        class="w-full bg-transparent border-b border-gray-500 text-white py-2 pl-2 focus:outline-none"
      />
      <p v-if="error" class="text-red-500 text-xs mt-1">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text',
  },
  error: String, 
  modelValue: String,
});

defineEmits(['update:modelValue']);
</script>
