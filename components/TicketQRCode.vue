<template>
  <div class="flex flex-col items-center justify-center">
    <div v-if="status === 'confirmed'" class="text-center">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">{{ title }}</h3>
      <div class="bg-white p-4 rounded-lg inline-block">
        <QrcodeVue :value="value" :size="size" :level="level" :background="background" :foreground="foreground" />
      </div>
      <p v-if="description" class="mt-4 text-sm text-gray-600">{{ description }}</p>
    </div>
    <div v-else class="text-center">
      <UIcon :name="icon" class="text-yellow-500 w-16 h-16 mb-4" />
      <p class="text-gray-800">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue';

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'confirmed'
  },
  title: {
    type: String,
    default: 'QR Code check-in'
  },
  description: {
    type: String,
    default: 'Quét mã này tại rạp để check-in'
  },
  errorMessage: {
    type: String,
    default: 'QR Code chỉ khả dụng khi vé đã được xác nhận'
  },
  size: {
    type: Number,
    default: 200
  },
  level: {
    type: String,
    default: 'H',
    validator: (value) => ['L', 'M', 'Q', 'H'].includes(value)
  },
  background: {
    type: String,
    default: '#FFFFFF'
  },
  foreground: {
    type: String,
    default: '#000000'
  },
  icon: {
    type: String,
    default: 'i-heroicons-exclamation-triangle'
  }
});
</script> 
