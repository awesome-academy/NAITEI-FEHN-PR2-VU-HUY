<!-- components/ShowtimeSection.vue -->
<template>
  <div>
    <h2 class="text-4xl font-bold mb-6 uppercase">{{ cinema }}</h2>

    <div v-if="showtimes.length > 0" class="flex items-center gap-4 mb-4">
      <div class="text-sm">All Showtimes</div>
      <span
        v-for="(amenity, index) in allAmenities"
        :key="index"
        class="bg-gray-500 text-black text-sm font-[600] mr-2 px-2.5 py-1 rounded"
      >
        {{ amenity }}
      </span>
    </div>

    <div v-else class="text-gray-500 text-xl my-8 w-full text-center">
      No showtimes available
    </div>


    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      <ShowtimeItem
        v-for="(showtime, index) in showtimes"
        :key="index"
        :time="showtime.time"
        :screen="showtime.screen"
        :type="showtime.amenities"
        :showtime_id="showtime.id"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showtimes: {
    type: Array,
    default: () => []
  },
  cinema: {
    type: String,
    default: 'LOTTE'
  }
});

// lấy mảng danh sách amenities nhưng ko trùng nhau
const allAmenities = computed(() => {
  const amenitiesSet = new Set();
  props.showtimes.forEach(showtime => {
    showtime.amenities?.forEach(amenity => {
      amenitiesSet.add(amenity);
    });
  });
  return Array.from(amenitiesSet);
});
</script>
