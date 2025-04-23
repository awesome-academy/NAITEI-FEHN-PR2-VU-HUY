<template>
  <div class="group relative">
    <NuxtLink :to="`/movies/${movie.id}`" class="block">
      <div class="aspect-[2/3] rounded overflow-hidden bg-gray-800 relative">
        <NuxtImg 
          :src="movie.posterUrl" 
          :alt="movie.title" 
          class="w-full h-full object-cover"
          placeholder
        />
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all"></div>
        <button 
          class="absolute top-0 left-0 w-12 h-12 bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style="clip-path: polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)"
          @click.prevent="openTrailer"
          >
          <Icon name="heroicons:play" class="w-6 h-6 text-white" />
        </button>
      </div>
      <h3 class="mt-2 font-bold text-center text-white uppercase">{{ movie.title }}</h3>
    </NuxtLink>
  </div>

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
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      title: '',
      posterUrl: '',
      trailerUrl: ''
    })
  }
})

const showTrailer = ref(false)

// Format YouTube URL for embedding if needed
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
  document.body.style.overflow = 'hidden' // Prevent scrolling when modal is open
}

function closeTrailer() {
  showTrailer.value = false
  document.body.style.overflow = '' // Restore scrolling
}

// Clean up event listener when component is unmounted
onUnmounted(() => {
  if (showTrailer.value) {
    document.body.style.overflow = ''
  }
})
</script>
