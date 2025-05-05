<!-- components/FilmDetails.vue -->
<template>
  <div class="flex flex-col border-b-1 py-8 px-4 border-gray-700 md:flex-row gap-8">
    <!-- Film Poster -->
    <div class="w-full md:w-1/4 lg:w-1/5">
      <div class="relative flex flex-col items-center">
        <NuxtImg
          :src="filmPoster"
          :alt="filmTitle"
          format="webp"
          class="w-full rounded-sm"
          loading="lazy"
        />
        
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
    </div>
    
    <!-- Film Info -->
    <div class="w-full md:w-3/4 lg:w-4/5">
      <div class="flex items-center justify-between gap-2 mb-4">
        <div class="flex flex-col">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">{{ filmTitle }}</h2>
          <div class="flex mb-2">
            <div class="flex  items-center gap-2 mr-2 text-gray-400">
              <Icon name="uil:clock" class="w-5 h-5" />
              <span>RUNTIME:</span>
            </div>
            <p>{{ filmRuntime }}'</p>
          </div>
        </div>
        <NuxtLink
          :to="`/movie/${filmId}`"
        >
          <Button>
            Buy Tickets
          </Button>
        </NuxtLink>
      </div>
      
      
      
      <!-- Synopsis -->
      <div>
        <p class="text-lg leading-relaxed">{{ filmSynopsis }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  filmId: {
    type: Number,
    required: true
  },
  filmTitle: {
    type: String,
    required: true
  },
  filmPoster: {
    type: String,
    required: true
  },
  filmRuntime: {
    type: String,
    required: true
  },
  filmSynopsis: {
    type: String,
    required: true
  },
  filmTrailer: {
    type: String,
    required: true,
  }
});

const showTrailer = ref(false)
const trailerEmbedUrl = computed(() => {
  if (!props.filmTrailer) return ''
  
  // Handle YouTube URLs
  if (props.filmTrailer.includes('youtube.com/watch?v=')) {
    const videoId = props.filmTrailer.split('v=')[1].split('&')[0]
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`
  }

  return props.filmTrailer
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
