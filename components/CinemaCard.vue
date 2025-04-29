<!-- Phiên bản cải tiến của CinemaCard.vue -->
<template>
  <NuxtLink :to="`/cinema/${id}`" class="cinema-card block transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <div class="relative overflow-hidden h-64 w-full rounded-lg">
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <h2 class="absolute bottom-4 left-4 text-4xl font-bold text-white font-display tracking-wider">{{ name }}</h2>
    </div>
    <div class="mt-4 text-white space-y-1">
      <p class="text-white font-bold text-lg">{{ city }}</p>
      <p class="text-gray-300">{{ address }}</p>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }
})
</script>
