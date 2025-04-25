<!-- pages/movie/[id].vue -->
<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
      <ULoader size="lg" color="primary" />
    </div>
    
    <div v-else-if="error" class="container mx-auto px-4 py-8 flex justify-center items-start min-h-screen">
      <UAlert type="danger" title="Error loading movie details">
        {{ error }}
      </UAlert>
    </div>
    
    <template v-else>
      <!-- Movie Hero Section -->
      <div class="relative">
        <div class="">
          <div class="flex flex-col md:flex-row gap-6">
            <!-- Movie Poster -->
            <div class="w-full md:w-1/4">
              <img :src="movie.poster" :alt="`${movie.title} Poster`" class="rounded-lg w-full">
              <Button class="w-full mt-4" @click="scrollToCinemaSelection">Book tickets</Button>
            </div>
            
            <!-- Movie Details -->
            <div class="w-full md:w-3/4">
              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-2xl font-bold">{{ movie.title }}</h1>
                <span v-if="movie.warning" class="text-yellow-400 text-2xl">⚠️</span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">DIRECTORS</h3>
                  <p>{{ movie.directors }}</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">RUNTIME</h3>
                  <p>{{ movie.duration }} minutes</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">CAST</h3>
                  <p>{{ movie.casts }}</p>
                </div>
                <div>
                  <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">RELEASE DATE</h3>
                  <p>{{ formatReleaseDate(movie.release_date) }}</p>
                </div>
              </div>
              
              <div class="flex flex-wrap gap-2 mb-4">
                <div v-for="(genre, index) in movie.genre" :key="index">
                  <span class="bg-transparent text-gray-200 text-sm font-semibold px-2 py-1 border border-white rounded">
                    {{ genre }}
                  </span>
                </div>
              </div>
              
              <div class="mb-6">
                <h3 class="text-gray-400 uppercase text-sm font-semibold mb-1">SYNOPSIS</h3>
                <p class="text-gray-200">
                  {{ movie.synopsis }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Trailer Section -->
      <div class="my-12">
        <PageTitle>Watch the Trailer</PageTitle>
        <div class="relative aspect-video max-w-4xl mx-auto bg-gray-800 rounded-lg overflow-hidden">
          <iframe 
            :src="trailerEmbedUrl"
            class="w-full h-full" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
      
      <!-- Showtimes Section -->
      <CinemaSelection id="cinema-selection" class="mt-4" :movie="movie" :showtimes="movie.showtimes" />
      
      <div class="border-t-1 my-8">
        <div class="flex border-b-1 py-4 flex-col md:flex-row items-center">
          <div class="w-full md:w-1/4">
            <img src="/images/family-films.jpg" alt="Family Tickets" class="w-full">
          </div>
          <div class="w-full md:w-2/4 p-4">
            <h3 class="text-xl font-bold mb-2">CINEMA MAGIC FOR LESS WITH OUR FAMILY TICKETS</h3>
            <p class="mb-4">Round up the kids! Grab some popcorn! And get ready to explore new worlds together.</p>
            <p class="text-sm">
              At ODEON, you can be sure to find something that the whole family can enjoy, and with our brilliant value <strong>Adult and Child Tickets</strong>, where the adults pay kids' prices, you can look forward to affordable, fun days out whatever the weather.
            </p>
          </div>
          <div class="w-full md:w-1/4 flex justify-center items-center">
            <Button>Find out more</Button>
          </div>
        </div>
        
        <div class="flex border-b-1 py-4 flex-col md:flex-row items-center">
          <div class="w-full md:w-1/4">
            <img src="/images/family-films.jpg" alt="Family Tickets" class="w-full">
          </div>
          <div class="w-full md:w-2/4 p-4">
            <h3 class="text-xl font-bold mb-2">CINEMA MAGIC FOR LESS WITH OUR FAMILY TICKETS</h3>
            <p class="mb-4">Round up the kids! Grab some popcorn! And get ready to explore new worlds together.</p>
            <p class="text-sm">
              At ODEON, you can be sure to find something that the whole family can enjoy, and with our brilliant value <strong>Adult and Child Tickets</strong>, where the adults pay kids' prices, you can look forward to affordable, fun days out whatever the weather.
            </p>
          </div>
          <div class="w-full md:w-1/4 flex justify-center items-center">
            <Button>Find your cinema</Button>
          </div>
        </div>
      </div>

      <!-- Related Article -->
      <div v-if="articles.length > 0" class="max-w-7xl mx-auto px-4 py-12">
        <PageTitle>Related Article</PageTitle>

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
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const movie = ref({});
const loading = ref(true);
const error = ref(null);
const articles = ref([]);

const { data: articlesData } = await useFetch('http://localhost:3001/News', {
  transform: (data) => {
    return data.map(article => ({
      ...article,
      imageUrl: article.image_url,
    }));
  }
});

articles.value = articlesData.value.filter(article => 
  article.related_movies.some(movie => 
    movie.movie_id == route.params.id
  )
);


onMounted(async () => {
  try {
    loading.value = true;
    const response = await fetch(`http://localhost:3001/Movies/${route.params.id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }
    
    movie.value = await response.json();

    movie.value.casts = movie.value.casts.join(', ');
    movie.value.directors = movie.value.directors.join(', ');
    movie.value.genre = movie.value.genre.split(', ');
    

    const showtimes = await fetch(`http://localhost:3001/Showtimes?movie_id=${route.params.id}`);
    if (!showtimes.ok) {
      throw new Error('Failed to fetch showtimes');
    }
    const showtimesData = await showtimes.json();
    movie.value.showtimes = showtimesData.map(showtime => ({
      time: showtime.showtime,
      theater: showtime.theater_id,
      screen: showtime.screen_id,
      amenities: showtime.amenities,
    }));

    console.log('movie.value:', movie.value);
    
  } catch (err) {
    console.error('Error fetching movie details:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const scrollToCinemaSelection = () => {
  const element = document.getElementById('cinema-selection');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const trailerEmbedUrl = computed(() => {  
  if (movie.value.trailer.includes('youtube.com/watch?v=')) {
    const videoId = movie.value.trailer.split('v=')[1].split('&')[0]
    console.log('videoId:', videoId)
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  return movie.value.trailer
})
</script>
