<template>
  <section class="py-10 container mx-auto px-4">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-center">EXPERIENCES</h2>
      <div class="border-y-2 border-blue-600 w-20 h-1.5 mb-8 mx-auto"></div>
    </div>

    <div class="relative">
      <div class="flex my-2 justify-end gap-2">   
        <button
          @click="prev"
        >
          <div class="flex align-center justify-center hover:bg-blue-900 transition-colors duration-300">
            <Icon name="i-heroicons-chevron-left" class="text-white" size="1.5rem" />
          </div>
        </button>
        
        <button
          @click="next"
        >
          <div class="flex align-center justify-center hover:bg-blue-900 transition-colors duration-300">
            <Icon name="i-heroicons-chevron-right" class="text-white" size="1.5rem" />
          </div>
        </button>
      </div>
      <Carousel
        ref="carouselRef"
        :items-to-show="1"
        :wrap-around="true"
      >
        <Slide v-for="(experience, index) in experiences" :key="index">
          <div class="flex flex-col md:flex-row bg-blue-950">
            <div class="md:w-1/2">
              <img :src="experience.image" :alt="experience.title" class="w-full h-full object-cover" />
            </div>
            <div class="md:w-1/2 p-8 bg-white text-blue-950">
              <h3 class="text-2xl font-bold mb-6">{{ experience.title }}</h3>
              <div class="space-y-4 text-gray-700">
                <p v-for="(paragraph, i) in experience.description" :key="i">
                  {{ paragraph }}
                </p>
              </div>
              <UButton
                v-if="experience.buttonText" 
                color="blue"
                variant="solid"
                class="mt-8 flex items-center"
              >
                {{ experience.buttonText }}
                <UIcon name="i-heroicons-chevron-right" class="ml-1" />
              </UButton>
            </div>
          </div>
        </Slide>

        <template #addons>
          <Pagination />
        </template>
      </Carousel>
    </div>
  </section>
</template>

<script setup>
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import 'vue3-carousel/carousel.css'
const carouselRef = ref()

const next = () => carouselRef.value.next()
const prev = () => carouselRef.value.prev()

const experiences = [
  {
    title: 'Bite-sized adventures',
    image: '/images/food-snacks.jpg',
    description: [
      'Get the full cinema experience and order from our delicious selection of hot meals, snacks, treats, beers, wines and soft drinks.',
      'Nothing beats watching a great film while tucking into a delicious feast. Choose a main, side and drink to enjoy a movie meal at your seat or if you\'re not sure what you\'re after, we\'ve made it easy for you with our pre selected combos!'
    ],
    buttonText: 'Food & Drinks'
  },
  {
    title: 'Ultimate comfort',
    image: '/images/luxury-seats.jpg',
    description: [
      'Enjoy the ultimate in cinema comfort with our luxurious recliner seats. Every seat is designed to give you more space and the perfect viewing angle.',
      'Sink into plush, comfortable seating with extra legroom and enjoy your movie in the best possible conditions.'
    ],
    buttonText: 'Learn More'
  },
  {
    title: 'Premium sound experience',
    image: '/images/sound-system.jpg',
    description: [
      'Immerse yourself in the action with our state-of-the-art Dolby Atmos sound system that puts you right in the middle of the story.',
      'Experience sound that flows all around you, even overhead, to fill the room with breathtaking realism and create a powerfully moving entertainment experience.'
    ],
    buttonText: 'Discover More'
  }
];
</script>

<style scoped>
:deep(.carousel__pagination) {
  bottom: -40px;
  margin-top: 1rem;
}

:deep(.carousel__pagination-button) {
  width: 10px;
  height: 10px;
  rotate: 45deg;
  border: 1px solid #ffffff;
  background-color: transparent;
  margin: 0 4px;
}

:deep(.carousel__pagination-button--active) {
  background-color: #ffffff;
}
</style>
