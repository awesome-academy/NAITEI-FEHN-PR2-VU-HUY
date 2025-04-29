<template>
  <section class="py-8 container mx-auto px-4 ">
    <h2 class="text-3xl font-bold text-center mb-2">Showtimes</h2>
    <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-10 mx-auto"></div>
  
    <DateSelector @date-selected="onDateSelected"/>

    <!-- Movie Listings -->
    <div class="space-y-8">
      <FilmShowtimes 
        v-for="movie in movies" 
        :key="movie.id" 
        :movie="movie" 
        :date="selectedDate" 
      />
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  cinemaId: {
    type: Number,
    required: true,
  },
});
const movies = ref({});
const selectedDate = ref({});

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3001/Movies/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    movies.value = await response.json();

    const showtimes = await fetch(`http://localhost:3001/Showtimes?theater_id=${props.cinemaId}`);
    if (!showtimes.ok) {
      throw new Error('Failed to fetch showtimes');
    }

    const showtimesData = await showtimes.json();
    console.log("showtimesData", showtimesData);
    
    movies.value = movies.value.map(movie => {
      const movieShowtimes = showtimesData.filter(showtime => showtime.movie_id == movie.id);
      return {
        ...movie,
        showtimes: movieShowtimes,
        trailerUrl: movie.trailer,
        genre: movie.genre.split(',').map(genre => genre.trim()),
      };
    });
    
  } catch (err) {
    console.error('Error fetching movie details:', err);
  }
});


const onDateSelected = (date) => {
  selectedDate.value = date;
  console.log("selected date:", selectedDate.value);
};

console.log("selected date", selectedDate.value);
</script>
