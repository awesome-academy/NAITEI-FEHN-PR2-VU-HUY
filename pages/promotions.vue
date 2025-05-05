<!-- pages/offers-competitions.vue -->
<template>
  <div class="min-h-screen">
    <!-- Header -->
    <div class="container  mx-auto px-4 py-6">
      <h2 class="text-3xl font-bold text-center mb-2">PROMOTIONS</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-8 mx-auto"></div>
    </div>

    <div class="container mx-auto px-4 py-6">
      <div class="space-y-2 border-t border-gray-700">
        <div v-for="promotion in promotions" :key="promotion.id">
          <HorizontalPromotionsCard
            :id="promotion.id"
            :title="promotion.title"
            :description="promotion.description"
            :expiryDate="promotion.expiryDate"
            :imageUrl="promotion.imageUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: promotions } = await useFetch('http://localhost:3001/Promotions', {
  transform: (data) => {
    return data.map((item) => ({
      ...item,
      expiryDate: new Date(item.valid_to).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      imageUrl: item.image
    }));
  }
});


</script>
