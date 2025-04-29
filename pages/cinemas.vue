<template>
  <div class="min-h-screen pb-12">
    <h2 class="text-3xl font-bold text-center mt-8 mb-2">CINEMAS</h2>
    <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-16 mx-auto"></div>

    <!-- Search Bar -->
    <div class="container mx-auto px-4 mb-12">
      <div class="bg-[#0A1C3A] p-6 flex flex-col md:flex-row justify-between items-center">
        <div class="flex items-center w-full md:w-auto mb-4 md:mb-0">
          <UInput
            placeholder="Search by name or location"
            v-model="searchQuery"
            color="white"
            variant="none"
            class="w-full md:w-80"
            :ui="{
              base: 'border-b-1 rounded-none bg-transparent text-white placeholder-gray-400 focus:outline-none',
              padding: 'px-4 py-2', 
            }"
          />  
        </div>
        <div class="flex items-center">
          <UButton
            color="blue"
            variant="solid"
            class="ml-2 text-blue-400 whitespace-nowrap text-md hover:bg-blue-600 hover:text-white transition duration-300"
            @click="filterByCity('Hà Nội')"
            :class="{ 'bg-blue-600 text-white': activeFilter === 'Hà Nội' }"
          >
            All Ha Noi Cinemas
          </UButton>
          <UButton
            color="blue"
            variant="solid"
            class="ml-2 text-blue-400 whitespace-nowrap text-md hover:bg-blue-600 hover:text-white transition duration-300"
            @click="filterByCity('Hồ Chí Minh')"
            :class="{ 'bg-blue-600 text-white': activeFilter === 'Hồ Chí Minh' }"
          >
            All Ho Chi Minh Cinemas
          </UButton>
        </div>
      </div>
    </div>

    <!-- Cinema Grid -->
    <div class="container mx-auto px-4">
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <USpinner size="lg" color="blue" />
      </div>
      <div v-else-if="filteredCinemas.length === 0" class="text-center py-12 text-gray-400">
        <p class="text-xl">Không tìm thấy rạp chiếu phim phù hợp với tiêu chí tìm kiếm</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CinemaCard
          v-for="cinema in filteredCinemas"
          :key="cinema.id"
          :id="cinema.id"
          :name="cinema.name"
          :image="cinema.image"
          :address="cinema.address"
          :city="cinema.city"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('');
const activeFilter = ref('all');
const isLoading = ref(true);

const { data: cinemas, pending } = await useFetch('http://localhost:3001/Theaters', {
  onResponse() {
    isLoading.value = false;
  },
  onResponseError() {
    isLoading.value = false;
  }
});

const filterByCity = (city) => {
  if (activeFilter.value === city) {
    activeFilter.value = 'all';
  } else {
    activeFilter.value = city;
  }
};

const resetFilter = () => {
  activeFilter.value = 'all';
};

const filteredCinemas = computed(() => {
  if (!cinemas.value) return [];
  
  let result = cinemas.value;
  
  if (activeFilter.value !== 'all') {
    result = result.filter(cinema => {
      return cinema.city.includes(activeFilter.value);
    });
  }
  
  if (searchQuery.value.trim()) {
    const keyword = searchQuery.value.toLowerCase();
    result = result.filter(cinema => {
      return cinema.name.toLowerCase().includes(keyword) || 
             cinema.address.toLowerCase().includes(keyword) ||
             cinema.city.toLowerCase().includes(keyword);
    });
  }
  
  return result;
});

watchEffect(() => {
  isLoading.value = pending.value;
});
</script>
