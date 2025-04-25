<template>
  <div class="min-h-screen text-white">
    <!-- Back Button -->
    <div class="container mx-auto px-4 py-6">
      <!-- Scene Header -->
      <div class="text-center mb-16">
        <h1 class="text-8xl font-bold tracking-wider mb-4">SCENE</h1>
        <p class="text-xl">
          Find out more about the films <span class="font-bold">you</span> love
        </p>
      </div>

      <!-- All Articles Section -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-center mb-2">ALL ARTICLES</h2>
        <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-10 mx-auto"></div>

        <!-- Categories Navigation -->
        <div class="flex flex-wrap items-center mb-8">
          <div class="flex overflow-x-auto">
            <button 
              v-for="category in categories" 
              :key="category.name"
              :class="[
                'px-8 py-2 font-medium text-lg transition-all', 
                activeCategory === category.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-white hover:text-blue-500 border-b-2 border-gray-200'
              ]"
              @click="activeCategory = category.id"
            >
              {{ category.name }}
            </button>
          </div>
          <div class="flex flex-1 font-medium text-lg justify-end items-center border-b-2 border-gray-200 gap-2 text-gray-300 px-3 py-2 hover:text-gray-400 rounded-none">
            <SelectMenu
              :categories="hiddenCategories"
              v-model="activeCategory"
              class="text-gray-300 hover:text-gray-400"
            />
          </div>
        </div>

        <!-- Articles Grid -->
        <div class="grid grid-cols-1 gap-8">
          <HorizontalArticleCard 
            v-for="article in filteredArticles" 
            :key="article.id" 
            :article="article" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
const route = useRoute();
const categories = [
  { id: 'latest', name: 'Latest' },
  { id: 'marvel', name: 'Marvel' },
  { id: 'vietnam', name: 'Vietnam' },
  { id: 'action', name: 'Action' },
];

const hiddenCategories = ref([
  { id: 'horror', name: 'Horror' },
  { id: 'comedy', name: 'Comedy' },
  { id: 'sci-fi', name: 'Sci-Fi' }
]);

const allCategories = [...categories, ...hiddenCategories.value];

const activeCategory = ref('');

if (route.query.category) {
  const category = allCategories.find(cat => cat.id === route.query.category);
  if (category) {
    activeCategory.value = category.id;
  } else {
    activeCategory.value = 'latest';
  }
} else {
  activeCategory.value = 'latest';
}


const { data: articles } = await useFetch('http://localhost:3001/News?', {
  transform: (data) => {
    return data.map(article => ({
      ...article,
      image: article.image_url,
    }));
  }
});

// Filter articles based on active category
const filteredArticles = computed(() => {
  if (activeCategory.value === 'latest') {
    return articles.value.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
  return articles.value.filter(article => 
    article.category && article.category.toLowerCase() === activeCategory.value
  );
});
</script>
