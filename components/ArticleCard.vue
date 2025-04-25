<template>
  <div class="bg-gray-900 rounded overflow-hidden">
    <div class="h-48 overflow-hidden">
      <NuxtImg 
        :src="article.imageUrl" 
        :alt="article.title" 
        class="w-full h-full object-cover"
        placeholder
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-bold mb-2">{{ article.title }}</h3>
      <p class="mb-3">{{ article.summary }}</p>
      <p class="mb-3">Last updated {{ formatDate(article.updated_at)   }}</p>
      <NuxtLink :to="`/new/${article.id}`" class="text-blue-400 font-[600] hover:text-blue-300">Read the full article</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns';
defineProps({
  article: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      summary: '',
      updated_at: '',
      imageUrl: '',
    })
  }
})

const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'dd MMM yyyy');
};
</script>
