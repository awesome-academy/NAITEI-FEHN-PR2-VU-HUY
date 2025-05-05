<template>
  <div class="min-h-screen">
    <div class="container mx-auto px-4 py-6  ">
      <h2 class="text-3xl font-bold text-center mb-2">{{ promotion.title }}</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-8 mx-auto"></div>
    </div>

    <!-- Offer Details -->
    <section class="">
      <div class="container mx-auto bg-[#0a1c3a] rounded-lg p-8 ">
        <div class="flex items-center gap-8">
          <!-- Left Content -->
          <div class="w-full">
            <p class="text-lg mb-4">
              {{ promotion.description }}
            </p>
            
            <p class="text-gray-400">Expires: {{ promotion.expiryDate }}</p>
          </div>
          
          <!-- Right Content - Image -->
          <div class="w-1/3">
            <NuxtImg
              :src="promotion.image"
              :alt="promotion.title"
              format="webp"
              class="w-full rounded-sm"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Film Details -->
    <div class="container mx-auto px-4 py-6 mt-6">
      <h2 class="text-3xl font-bold text-center mb-2">APPLICABLE TO</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-8 mx-auto"></div>
    </div>
    <section class="border-t container mx-auto border-gray-800">
      <div class="container mx-auto">
        <PromotionMovieCard
          v-for="movie in relatedMovies"
          :key="movie.id"
          :filmId="movie.id"
          :filmTitle="movie.title"
          :filmPoster="movie.poster"
          :filmRuntime="movie.duration"
          :filmSynopsis="movie.synopsis"
          :filmTrailer="movie.trailer"
        />  
      </div>
    </section>

    <!-- Descriptions -->
    <section class="py-12">
      <div class="container mx-auto">
        <h2 class="text-2xl font-bold text-center mb-2">DESCRIPTIONS</h2>
        <div class="border-b-2 border-blue-600 w-20 h-1.5 mb-8 mx-auto"></div>
        
        <span>
          {{ promotion.full_description }}
        </span>
      </div>
    </section>
  </div>
</template>

<script setup>
const route = useRoute();
const promotion = ref({});
const relatedMovies = ref([]);

onMounted(async () => {
  try {
    const promotionData = await fetch(`http://localhost:3001/Promotions/${route.params.id}`);
    if (!promotionData.ok) {
      throw new Error('Failed to fetch promotion details');
    }
    promotion.value = await promotionData.json();
    
    promotion.value.expiryDate = new Date(promotion.value.valid_to).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    console.log("promotion", promotion.value);

    promotion.value.related_movies.forEach(async (movieId) => {
      const movieData = await fetch(`http://localhost:3001/Movies/${movieId}`);
      if (!movieData.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const movie = await movieData.json();
      relatedMovies.value.push(movie);
    });
    console.log("relatedMovies", relatedMovies.value);
  } catch (error) {
    console.error('Error fetching offer details:', error);
  }
});
</script>
