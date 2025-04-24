<template>
  <div class="min-h-screen">
    <HeroCarousel />

    <section class="container mx-auto py-10 px-4">
      <PageTitle>TOP FILMS</PageTitle>
      
      <div class="relative">
        <Carousel
          ref="carouselRef"
          v-model="currentSlide" 
          v-bind="config"
        >
          <Slide v-for="(film, index) in topFilms" :key="index">
            <MovieCard
              :movie="film"
            />
          </Slide>
        </Carousel>
      </div>

      <div class="flex mt-12 justify-center gap-8">   
        <button
          @click="prev"
          class="transform -translate-y-1/2 w-10 h-10 rotate-45 bg-blue-900 border border-gray-400 hover:border-blue-500 flex items-center justify-center shadow-md transition-colors duration-300"
        >
          <div class="-rotate-45 flex align-center justify-center">
            <Icon name="i-heroicons-chevron-left" class="text-white" size="1.35rem" />
          </div>
        </button>
        
        <button
          @click="next"
          class="transform -translate-y-1/2 w-10 h-10 rotate-45 bg-blue-900 border border-gray-400 hover:border-blue-500 flex items-center justify-center shadow-md transition-colors duration-300"
        >
          <div class="-rotate-45 flex align-center justify-center">
            <Icon name="i-heroicons-chevron-right" class="text-white" size="1.35rem" />
          </div>
        </button>
      </div>
    </section>

    <!-- Banner Section -->

    <section class="w-full">
      <NuxtImg
        :src="'images/odeon-kids.jpg'"
        :alt="'Odeon Kids'"
        class="mx-auto h-[100px]"
      />
    </section>
    
    <!-- All Films Section -->
    <section class="container mx-auto py-10 px-4">
      <PageTitle>ALL FILMS</PageTitle>
      
      <!-- Filter Tabs -->
      <div class="mb-8">
        <div class="flex items-center">
          <div class="flex">
            <button 
              v-for="tab in tabItems" 
              :key="tab.value"
              @click="changeTabs(tab.value)"
              class="px-6 py-2 font-medium text-lg transition-all"
              :class="activeTab === tab.value ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-gray-200'"
            >
              {{ tab.label }}
            </button>
          </div>
          <UModal 
            v-model:open="isOpen"
            :ui="{
              content: 'bg-[#0a1c3a] w-full sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px] rounded-lg shadow-lg max-w-5xl',
            }"
          >
            <UButton 
              class="flex flex-1 font-medium text-lg justify-end items-center border-b-2 border-gray-200 gap-2 text-gray-300 px-3 py-2 hover:text-gray-400 rounded-none"
              :ui="{
                base: 'flex flex-1 justify-end items-center gap-2 font-medium text-gray-300 hover:text-gray-400 border-b-2 border-gray-200',
                font: 'text-lg',
                padding: 'px-3 py-2'
              }"
              color="neural"
            >
              <Icon
                name="i-lucide:list-filter"
                size="1.35rem"
              />
              <span>Filter by</span>
            </UButton>
            <template #content>
              <div class="px-6 sm:px-12 md:px-24 py-8 sm:py-12">
              <div class="relative w-full">
                <button @click="isOpen = false" class="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700">
                  <Icon name="i-lucide:x" size="1.5rem" />
                </button>
              </div>
              <PageTitle>Filters</PageTitle>

              <div class="space-y-6">
                <div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
                    <FilterCheckbox v-model="filters.lichsu" label="Lịch sử" />
                    <FilterCheckbox v-model="filters.hanhdong" label="Hành động" />
                    <FilterCheckbox v-model="filters.hoathinh" label="Hoạt hình" />
                    <FilterCheckbox v-model="filters.tamly" label="Tâm lý" />
                    <FilterCheckbox v-model="filters.tinhcam" label="Tình cảm" />
                    <FilterCheckbox v-model="filters.haihuoc" label="Hài hước" />
                    <FilterCheckbox v-model="filters.kinhdi" label="Kinh dị" />
                    <FilterCheckbox v-model="filters.phieuluu" label="Phiêu lưu" />
                    <FilterCheckbox v-model="filters.trinhtham" label="Trinh thám" />
                    <FilterCheckbox v-model="filters.giadinh" label="Gia đình" />
                  </div>
                </div>
              </div>
              
              <div class="mt-10 text-center">
                <div class="text-gray-300 mb-6 italic">
                  <p v-if="hasActiveFilters">
                    <strong>{{ filteredFilmsCount }}</strong> film(s) found
                  </p>
                  <p v-else>
                    Select filters to update results
                  </p>
                </div>
                <div class="flex items-center justify-center gap-4">
                  <UButton 
                    v-if="hasActiveFilters"
                    @click="resetFilters"
                    class="bg-gray-600 hover:bg-gray-700 text-white font-medium px-12 py-3 rounded-md"
                  >
                    Clear
                  </UButton>
                  <UButton 
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-12 py-3 rounded-md"
                    @click="applyFilters"
                  >
                    Apply
                  </UButton>
                </div>
              </div>
            </div>
            </template>
          </UModal>
        </div>
        
        <div class="p-4">
          <div v-if="activeTab === 'all'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MovieCard v-for="movie in currentMovies" :key="movie.id" :movie="movie" />
          </div>
          <div v-else-if="activeTab === 'nowShowing'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MovieCard v-for="movie in currentMovies" :key="movie.id" :movie="movie" />
          </div>
          <div v-else-if="activeTab === 'comingSoon'" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MovieCard v-for="movie in currentMovies" :key="movie.id" :movie="movie" />
          </div>
        </div>  
      </div>
    </section>
  </div>
</template>

<script setup>
import { Carousel, Navigation, Slide } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'

const tabItems = [
  { label: 'All', value: 'all' },
  { label: 'Now Showing', value: 'nowShowing' },
  { label: 'Coming Soon', value: 'comingSoon' },
]
const activeTab = ref('all')
const isOpen = ref(false)

const { data: movies } = await useFetch('http://localhost:3001/Movies?', {
  transform: (data) => {
    return data.map(movie => ({
      ...movie,
      posterUrl: movie.poster,
      trailerUrl: movie.trailer,
      isTrending: movie.is_trending
    }));
  }
});
const nowShowingFilms = movies.value.filter(movie => movie.status === 'showing');
const comingSoonFilms = movies.value.filter(movie => movie.status === 'coming-soon');
const topFilms = movies.value.filter(movie => movie.isTrending === true);

const carouselRef = ref()
const currentSlide = ref(1)
const currentMovies = ref(movies.value)

const config = {
  itemsToShow: 1,
  autoplay: 4000,
  gap: 5,
  snapAlign: 'center',
  wrapAround: true,
  pauseAutoplayOnHover: true,
  breakpointMode: 'carousel',

  breakpoints: {
    500: {
      itemsToShow: 2,
      snapAlign: 'center',
    },
    800: {
      itemsToShow: 3,
      snapAlign: 'start',
    },
    1200: {
      itemsToShow: 4,
      snapAlign: 'start',
    },
  },
}

const filters = ref({
  lichsu: false,
  hanhdong: false,
  hoathinh: false,
  tamly: false,
  tinhcam: false,
  haihuoc: false,
  kinhdi: false,
  phieuluu: false,
  trinhtham: false,
  giadinh: false
})

// Hàm này sẽ được gọi khi người dùng nhấn nút "Apply" trong modal sẽ đặt currentMovies bằng các film theo tab thỏa mãn filters
const applyFilters = () => {
  isOpen.value = false
  currentMovies.value = currentMovies.value.filter(movie => {
    const genres = movie.genre.split(', ')
    return Object.keys(filters.value).some(key => {
      return filters.value[key] && genres.includes(genreConvert[key])
    })
  })  
}

const next = () => carouselRef.value.next()
const prev = () => carouselRef.value.prev()

const changeTabs = (value) => {
  activeTab.value = value
  currentMovies.value = value === 'all' ? movies.value : value === 'nowShowing' ? nowShowingFilms : comingSoonFilms
}

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some(value => value === true)
})

// genre của tôi đang có dạng "genre": "Hoạt hình, Phiêu lưu", hãy tạo hàm filter ra được key hoathinh chẳng hạn

const genreConvert = {
  lichsu: 'Lịch sử',
  hanhdong: 'Hành động',
  hoathinh: 'Hoạt hình',
  tamly: 'Tâm lý',
  tinhcam: 'Tình cảm',
  haihuoc: 'Hài hước',
  kinhdi: 'Kinh dị',
  phieuluu: 'Phiêu lưu',
  trinhtham: 'Trinh thám',
  giadinh: 'Gia đình'
}

const filteredFilmsCount = computed(() => {
  return currentMovies.value.filter(movie => {
    const genres = movie.genre.split(', ')
    return Object.keys(filters.value).some(key => {
      return filters.value[key] && genres.includes(genreConvert[key])
    })
  }).length
})

const resetFilters = () => {
  Object.keys(filters.value).forEach(key => {
    filters.value[key] = false
  })
}

</script>
