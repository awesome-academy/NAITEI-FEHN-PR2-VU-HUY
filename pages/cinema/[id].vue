<template>
  <div class="min-h-screen pb-12 text-white">
    <div v-if="pending" class="flex justify-center py-10">
      <LoadingSpinner />
    </div>
    
    <template v-else>
      <CinemaInfo v-if="cinema" :cinema="cinema" />
      
      <MoviesShowtimes :cinemaId="cinemaId"/>
      
      <CinemaExperiences />
    </template>
  </div>
</template>

<script setup>
const route = useRoute();
const cinemaId = route.params.id;

const { data: cinema, pending, error } = useFetch(`http://localhost:3001/Theaters/${cinemaId}`);

watchEffect(() => {
  if (error.value) {
    console.error('Failed to fetch cinema details:', error.value);
  }
});
</script>
