<template>
  <div v-if="hasShowtimes" class="p-6 border-b-1">
    <div class="flex flex-col md:flex-row gap-6">
      <div class="md:w-1/4 lg:w-1/5 flex flex-col items-center">
        <div class="relative aspect-[2/3] rounded overflow-hidden">
          <img :src="movie.poster" :alt="movie.title" class="w-full h-full object-cover" />
        </div>
        <button @click.prevent="openTrailer" class="text-blue-400 mt-6 flex items-center">
          <UIcon name="i-heroicons-play" class="mr-1" />
          Play trailer
        </button>

        <div v-if="showTrailer" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div class="relative w-full max-w-4xl mx-4">
            <button
              @click="closeTrailer"
              class="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <Icon name="heroicons:x-mark" class="w-8 h-8" />
            </button>
            <div class="aspect-video w-full">
              <iframe
                :src="trailerEmbedUrl"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <!-- Movie Info -->
      <div class="md:w-3/4 lg:w-4/5">
        <h3 class="text-2xl font-bold mb-3">{{ movie.title }}</h3>
        <p class="text-gray-300 mb-4">{{ movie.synopsis }}</p>

        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
          <div v-for="(genre, index) in movie.genre" :key="index">
            <span class="bg-transparent text-gray-200 text-sm font-semibold px-2 py-1 border border-white rounded">
              {{ genre }}
            </span>
          </div>
          </div>
          <div class="flex items-center">
            <span class="text-sm text-gray-400 mr-2">Duration:</span>
            <span class="text-lg font-semibold">{{ movie.duration }} min</span>
          </div>
        </div>

        <!-- All Showtimes -->
        <div>
          <div class="flex items-center mb-3">
            <h4 class="font-semibold">All Showtimes</h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <ShowtimeItem
              v-for="showtime in showtimesByDate"
              :key="showtime.id"
              :showtime_id="showtime.id"
              :time="showtime.showtime"
              :screen="showtime.screen_id"
              :type="showtime.amenities"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  date: {
    type: Object,
    required: true
  }
});

const hasShowtimes = computed(() => {
  return props.movie.showtimes && props.movie.showtimes.length > 0 &&
         props.movie.showtimes.some(showtime => {
           const showtimeDate = new Date(showtime.showtime);
           return showtimeDate.toLocaleString('en-GB', { month: 'short' }) === props.date.month &&
                  showtimeDate.getDate() === parseInt(props.date.number);
         });
});

const showtimesByDate = computed(() => {
  if (!props.movie.showtimes) return [];
  return props.movie.showtimes.filter(showtime => {
    const showtimeDate = new Date(showtime.showtime);
    return showtimeDate.toLocaleString('en-GB', { month: 'short' }) === props.date.month &&
           showtimeDate.getDate() === parseInt(props.date.number);
  });
});

console.log(showtimesByDate)

const showTrailer = ref(false)
const trailerEmbedUrl = computed(() => {
  if (!props.movie.trailerUrl) return ''

  // Handle YouTube URLs
  if (props.movie.trailerUrl.includes('youtube.com/watch?v=')) {
    const videoId = props.movie.trailerUrl.split('v=')[1].split('&')[0]
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  return props.movie.trailerUrl
})

function openTrailer(event) {
  event.stopPropagation()
  showTrailer.value = true
  document.body.style.overflow = 'hidden'
}

function closeTrailer() {
  showTrailer.value = false
  document.body.style.overflow = ''
}

onUnmounted(() => {
  if (showTrailer.value) {
    document.body.style.overflow = ''
  }
})
</script>
