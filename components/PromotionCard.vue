<template>
  <div 
    class="bg-white rounded-lg overflow-hidden border border-gray-800"
    style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), calc(100% - 48px) 100%, 0 100%)"
  >
    <div class="p-6">
      <NuxtLink :to="`/promotion/${promotion.id}`">
        <NuxtImg 
          :src="promotion.imageUrl" 
          :alt="promotion.title" 
          class="w-full object-contain"
          placeholder
        />
      </NuxtLink>
      <h3 class="font-bold my-6 text-[20px] text-gray-700">{{ promotion.title }}</h3>
      <p class="mb-3 line-clamp-3 text-gray-600">
        {{ promotion.description }}
      </p>
      <p class="mb-4 text-gray-500">
        Expires: {{ formatDate(promotion.expiryDate) }}
      </p>
      <NuxtLink :to="`/promotion/${promotion.id}`" class="text-blue-400 hover:text-blue-500 font-[600] flex items-center">
        Find out more
        <Icon name="heroicons:chevron-right" class="w-4 h-4 ml-1" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns';

defineProps({
  promotion: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      description: '',
      imageUrl: '',
    })
  }
})

const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'dd/MM/yyyy');
};
</script>
