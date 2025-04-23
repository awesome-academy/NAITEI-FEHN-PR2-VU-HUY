<template>
  <div class="relative w-full max-w-6xl mx-auto">
    <!-- Carousel Slides -->
    <div class="relative w-full h-[400px] overflow-hidden rounded-lg">
      <div
        v-for="(slide, index) in slides"
        :key="index"
        :class="[
          'absolute inset-0 flex items-center justify-between transition-opacity duration-500 p-8',
          currentSlide === index ? 'opacity-100' : 'opacity-0'
        ]"
      >
        <img
          :src="slide.image"
          :alt="slide.title"
          class="w-full h-auto object-contain"
          loading="lazy"
        />
        <div class="absolute inset-0 w-1/2 flex flex-col justify-center space-y-4">
          <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight title-font">
            {{ slide.title }}
          </h1>
          <button
            class="w-fit px-4 py-2 text-white border border-white hover:bg-white hover:text-blue-900 transition"
          >
            {{ slide.buttonText }}
          </button>
        </div>

        
      </div>
    </div>

    <button
      @click="prevSlide"
      class="absolute right-[-32px] top-40 transform -translate-y-1/2 w-10 h-10 rotate-45 bg-blue-900 border border-gray-400 hover:border-blue-500 flex items-center justify-center shadow-md transition-colors duration-300"
    >
      <div class="-rotate-45 flex align-center justify-center">
        <Icon name="i-heroicons-chevron-left" class="text-white" size="1.35rem" />
      </div>
    </button>
    
    <button
      @click="nextSlide"
      class="absolute right-[-32px] top-60 transform -translate-y-1/2 w-10 h-10 rotate-45 bg-blue-900 border border-gray-400 hover:border-blue-500 flex items-center justify-center shadow-md transition-colors duration-300"
    >
      <div class="-rotate-45 flex align-center justify-center">
        <Icon name="i-heroicons-chevron-right" class="text-white" size="1.35rem" />
      </div>
    </button>

    <div class="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'w-3 h-3 rounded-full',
          currentSlide === index ? 'bg-white' : 'bg-gray-400'
        ]"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useIntervalFn } from '@vueuse/core';

const currentSlide = ref(0);
const slides = ref([
  {
    title: 'YOUR TICKET TO INFINITE CINEMA',
    buttonText: 'From only £16.99/month*',
    image: '/images/infinite-cinema.jpg',
    visual: 'infinity-symbol',
  },
  {
    title: 'EARN POINTS, GET EXTRAS.',
    buttonText: 'Join fast, for free',
    image: '/images/earn-points.jpg',
    visual: 'x-symbol',
  },
  {
    title: 'GIVE THE GIFT OF CINEMA',
    buttonText: 'Buy Gift cards online',
    image: '/images/gift-cards.jpg',
    visual: 'gift-cards',
  },
  {
    title: 'FAMILY FILMS FOR LESS',
    buttonText: 'Find out more',
    image: '/images/family-films.jpg',
    visual: 'cartoon-characters',
  }
])

// Hàm chuyển slide
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

// Tự động chuyển slide mỗi 5 giây
const { pause, resume } = useIntervalFn(nextSlide, 5000);

onMounted(() => resume());
onUnmounted(() => pause());
</script>

<style scoped>
.title-font {
  font-family: Machine, Helvetica, Arial, sans-serif;
  font-size: 60px;
  letter-spacing: 0px;
  line-height: 84px;
}
</style>
