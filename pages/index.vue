<template>
  <div class="">
    <HeroCarousel />
  
    <!-- Top Films Section -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-center mb-2">TOP FILMS</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-10 mx-auto"></div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
      </div>
    </div>
    
    <div class="bg-gray-900 py-8 relative">
      <div class="flex flex-col md:flex-row w-full">
        <div class="w-full relative">
          <img
            src="/images/hero-banner.jpg"
            alt="Hero Banner"
            class="w-full h-auto object-contain"
          >
          <div class="absolute inset-0 flex flex-col justify-center px-24 pr-[66%]">
            <h3 class="font-bold text-[20px] mb-4 text-white">Thunderbolts*</h3>
            <p class="mb-4 text-white">
              Expect fireworks as director Jake Schreier's MCU Phase 5 grand finale throws a rogue's gallery of heroes into the fray, including Florence Pugh’s Yelena Belova and Sebastian Stan’s Bucky Barnes to face a cosmic threat.
            </p>
            <NuxtLink :to="'/movie/10'" class="mt-4 text-blue-500 text-[18px] font-[600] flex items-center gap-1">
              Book tickets
              <Icon name="lucide:chevron-right" class="w-4 h-4"/>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-2">LATEST MOVIE NEWS</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-10 mx-auto"></div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id" 
          :article="article"
        />
      </div>
      
      <div class="flex justify-center mt-8">
        <NuxtLink
          :to="'/news'" 
          class="bg-blue-800 hover:bg-blue-900 text-white px-6 py-4 font-medium "
          style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)"
        >
          Browse All News
        </NuxtLink>
      </div>
    </div>
    
    <!-- Offers & Competitions Section -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <h2 class="text-3xl font-bold text-center mb-2">PROMOTIONS</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-10 mx-auto"></div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PromotionCard 
          v-for="promotion in promotions" 
          :key="promotion.id" 
          :promotion="promotion"
        />
      </div>
      
      <div class="flex justify-center mt-8">
        <NuxtLink
          :to="'/promotions'" 
          class="bg-blue-800 hover:bg-blue-900 text-white px-6 py-4 font-medium "
          style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)"
        >
          See More Of Our Promotions
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});

const { data: movies } = await useFetch('http://localhost:3001/Movies?status=showing', {
  transform: (data) => {
    return data.map(movie => ({
      ...movie,
      posterUrl: movie.poster,
      trailerUrl: movie.trailer
    }));
  }
});

const { data: articles } = await useFetch('http://localhost:3001/News?_limit=3', {
  transform: (data) => {
    return data.map(article => ({
      ...article,
      imageUrl: article.image_url,
    }));
  }
});

const { data: promotions } = await useFetch('http://localhost:3001/Promotions?_limit=3', {
  transform: (data) => {
    return data.map(promotion => ({
      ...promotion,
      imageUrl: promotion.image,
      expiryDate: promotion.valid_to,
    }));
  }
});
</script>
