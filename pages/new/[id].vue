<template>
  <div class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-6">
      <div class="flex items-center max-w-6xl mx-auto text-md mb-4">
        <NuxtLink to="/news" class="text-blue-400 hover:text-white transition-colors">News</NuxtLink>
        <Icon name="mdi:chevron-right" class="w-4 h-4 mx-1 text-blue-400" />
        <NuxtLink :to="`/news?category=${article.category.toLowerCase()}`" class="text-blue-400 hover:text-white transition-colors">{{ article.category }}</NuxtLink>
      </div>
      
      <!-- Hero Image with Title Overlay -->
      <div class="relative max-w-6xl mx-auto rounded-lg overflow-hidden mb-8">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          class="w-full h-full object-cover"
          placeholder
        />
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-blue-950 to-transparent">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            {{ article.title }}
          </h1>
          <div class="flex items-center text-sm">
            <span class="flex items-center mr-6">
              <Icon name="mdi:calendar" class="w-4 h-4 mr-2" />
              Last updated {{ formatDate(article.updated_at) }}
            </span>
            <span class="flex items-center">
              <Icon name="mdi:clock-outline" class="w-4 h-4 mr-2" />
              {{ article.read_time }} min read
            </span>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="max-w-5xl mx-auto">
        <!-- Article Introduction -->
        <div class="mb-8 text-lg">
          <p class="mb-4">
            {{ article.summary }}
          </p>
          
          <div class="flex items-center gap-4">
            <div v-for="(movie, index) in relatedMovies" :key="index" class="flex-1 flex justify-center">
              <NuxtLink
                :to="`/movie/${movie.id}`"
              >
                <Button>
                  Book Tickets For {{ movie.title }}
                </Button>
              </NuxtLink>
            </div>
          </div>
          
          <hr class="border-blue-800 my-10" />
          
          <!-- Content Sections -->
          <section class="mb-12">
            <p>
              {{ article.content }}
            </p>
          </section>
          
          
          <section class="mb-12">
            <div v-for="(movie, index) in relatedMovies" :key="index" class="mb-8 bg-blue-900 p-6 rounded-lg">
              <h2 class="text-2xl font-bold mb-6">{{ movie.title }} Release Information</h2>   
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-gray-200 uppercase text-sm font-bold mb-1">DIRECTORS</h3>
                  <p>{{ movie.directors }}</p>
                </div>
                <div>
                  <h3 class="text-gray-200 uppercase text-sm font-bold mb-1">RUNTIME</h3>
                  <p>{{ movie.duration }} minutes</p>
                </div>
                <div>
                  <h3 class="text-gray-200 uppercase text-sm font-bold mb-1">CAST</h3>
                  <p>{{ movie.casts }}</p>
                </div>
                <div>
                  <h3 class="text-gray-200 uppercase text-sm font-bold mb-1">RELEASE DATE</h3>
                  <p>{{ formatDate(movie.release_date) }}</p>
                </div>
              </div>
            </div>
          </section>
          
          <div class="max-w-7xl mx-auto px-4 py-12">
            <PageTitle>Related Articles</PageTitle>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ArticleCard 
                v-for="article in relatedArticles" 
                :key="article.id" 
                :article="article"
              />
            </div>
            
            <div class="flex justify-center mt-8">
              <NuxtLink
                :to="`/news?category=${article.category.toLowerCase() }`"
                class="bg-blue-800 hover:bg-blue-900 text-white px-6 py-4 font-medium "
                style="clip-path: polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)"
              >
                Browse All News
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();

const { data: article } = await useAsyncData(
  'article',
  () => $fetch(`http://localhost:3001/News/${route.params.id}`)
    .then(data => ({
      ...data,
      image: data.image_url
    }))
);

const { data: relatedArticles } = await useAsyncData(
  'relatedArticles',
  async () => {
    if (!article.value) return [];
    
    const data = await $fetch('http://localhost:3001/News', {
      params: {
        category: article.value.category,
        id_ne: article.value.id,
        _limit: 3
      }
    });
    
    return data.map(item => ({
      ...item,
      imageUrl: item.image_url
    }));
  },
  { watch: [article] }
);

const relatedMovies = ref([]);

onMounted(async() => {
  try {
    for (const movie of article.value.related_movies) {
      const response = await fetch(`http://localhost:3001/Movies/${movie.movie_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie details');
      }
      const movieData = await response.json();
      movieData.directors = movieData.directors.join(', ');
      movieData.casts = movieData.casts.join(', ');

      relatedMovies.value.push(movieData);
    }
  } catch (error) {
    console.error('Error fetching related movies:', error);
  }
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>
