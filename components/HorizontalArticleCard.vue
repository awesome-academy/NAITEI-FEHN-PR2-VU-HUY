<template>
  <div class="flex flex-col md:flex-row w-full pb-8 border-b-1 overflow-hidden">
    <!-- Image Section -->
    <NuxtLink :to="`/new/${article.id}`" class="block w-1/2">
      <NuxtImg 
        :src="article.image" 
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        placeholder
      />
    </NuxtLink>
    
    <!-- Content Section -->
    <div class="w-full md:w-1/2 lg:w-2/5 p-6 flex-1 flex flex-col justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white mb-4">
          {{ article.title }}
        </h2>
        
        <div class="mb-4">
          <NuxtLink :to="article.categoryLink" class="inline-block">
            <span class="px-8 py-2 rounded-full bg-blue-900 text-white font-semibold text-sm uppercase border border-blue-800">
              {{ article.category }}
            </span>
          </NuxtLink>
        </div>
        
        <p class="text-white mb-6">
          {{ article.summary }}
        </p>
      </div>
      
      <div>
        <p class="mb-3">Last updated {{ formatDate(article.updated_at)   }}</p>
        
        <NuxtLink :to="`/new/${article.id}`" class="text-blue-400 font-[600] hover:text-blue-300">Read the full article</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { format, parseISO } from 'date-fns';
defineProps({
  article: {
    type: Object,
    required: true
  }
});

const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return format(date, 'dd MMM yyyy');
};
</script>
