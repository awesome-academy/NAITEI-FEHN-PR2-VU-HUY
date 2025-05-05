<!-- components/OfferItem.vue -->
<template>
  <div class="border-b border-gray-700 py-8">
    <div class="container mx-auto">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Image Section -->
        <div class="w-1/3">
          <NuxtImg
            :src="imageUrl"
            :alt="title"
            format="webp"
            class="w-full rounded-sm"
            loading="lazy"
          />
        </div>
        
        <!-- Content Section -->
        <div class="w-full w-3/4 flex flex-col justify-between">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ title }}</h2>
            
            <p class="text-lg mb-2 line-clamp-3">
              {{ description }} 
            </p>
            
          </div>
          
          <div class="flex items-center justify-between mt-6">
            <p class="text-gray-400 leading-10  ">Expires: {{ expiryDate }}</p>
            
            <NuxtLink 
              :to="'/promotion/' + id"
              class="md:w-1/4"
            >
              <Button
                class="px-6 py-2"
              >
                Find out more
              </Button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  expiryDate: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  }
});
</script>
