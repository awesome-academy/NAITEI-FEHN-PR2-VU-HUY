<template>
  <section class="py-8 container min-h-[600px] mx-auto px-4">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Thông tin rạp -->
      <div class="lg:w-1/2">
        <h1 class="text-4xl font-bold mb-4">{{ cinema.name }}</h1>
        <div class="relative h-64 mb-6 overflow-hidden rounded-lg">
          <img :src="cinema.image" alt="Cinema" class="w-full h-full object-cover" />
        </div>
        <div class="space-y-4">
          <div class="flex text-xl items-start gap-2">
            <UIcon name="i-heroicons-map-pin" class="text-blue-400 mt-[1px] flex-shrink-0" />
            <p>{{ cinema.address }}, {{ cinema.city }}</p>
          </div>
          <p>{{ cinema.description }}</p>
        </div>
      </div>

      <!-- Google Maps -->
      <div class="lg:w-1/2 h-96">
        <h2 class="text-xl font-semibold mb-4">Vị trí rạp</h2>
        <GoogleMap 
          :location="cinema.location"
          :zoom="15"
        />
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  cinema: {
    type: Object,
    required: true
  }
});

</script>
