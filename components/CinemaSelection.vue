<template>
  <div>
    <div class="flex justify-between items-center mb-6 bg-[#031c3a] px-8 py-6 rounded-md">
      <div class="flex items-center gap-2">
        <h2 class="text-xl">Show me times for 
          <span 
            class="text-blue-400 cursor-pointer hover:underline"
            @click="() => {
              isOpen = true;
            }"
          >
            {{ selectedCinema ? selectedCinema.name : 'Cinemas' }}
          </span>
        </h2>
      </div>
    </div>

    <div v-if="!selectedCinema" class="py-16 flex flex-col items-center text-center">
      <h3 class="text-2xl font-bold mb-4">No cinemas selected.</h3>
      <p class="text-xl mb-8">Where would you like to see the film?</p>
      <div class="w-1/3">
        <Button @click="() => { isOpen = true; }">
          Choose your cinema
        </Button>
      </div>
    </div>

    <div v-else>
      <DateSelector @date-selected="onDateSelected"/>
          
      <ShowtimeSection 
        :cinema="selectedCinema.name ? selectedCinema.name : 'Cinemas'" 
        :showtimes="cinemaShowtimesByDate" 
      />
    </div>

    <UModal
      v-model:open="isOpen"
      :ui="{
        content: 'bg-[#0a1c3a] w-full sm:w-[600px] md:w-[700px] lg:w-[800px] xl:w-[900px] 2xl:w-[1000px] rounded-lg shadow-lg max-w-5xl',
      }"
    >
      <template #content>
        <div class="px-6 sm:px-12 md:px-24 py-8 sm:py-12">
          <div class="relative w-full">
            <button @click="isOpen = false" class="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700">
              <Icon name="i-lucide:x" size="1.5rem" />
            </button>
          </div>
          <div class="mt-8">
            <UInput
              v-model="searchQuery"
              placeholder="Search by name or location"
              variant="none"
              class="mb-4 w-full text-white"
              :ui="{
                base: 'border-b-1 rounded-none bg-transparent text-white placeholder-gray-400 focus:outline-none',
                padding: 'px-4 py-2', 
              }"
            />

            <p class="text-gray-400 mb-4">Showing {{ filteredCinemas.length }} locations (select 1)</p>

            <div class="max-h-96 overflow-y-auto">
              <div 
                v-for="cinema in filteredCinemas" 
                :key="cinema.id"
                class="border-b border-gray-700 py-4"
              >
                <div class="flex items-center">
                  <input 
                    type="radio" 
                    :value="cinema.id" 
                    v-model="selectedCinemaId" 
                    class="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div class="ml-3">
                    <h4 class="font-bold">{{ cinema.name }}</h4>
                    <p class="text-gray-400">{{ cinema.address }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <Button
                class="w-50"
                @click="() => {
                  saveCinemaSelection();
                  isOpen = false;
                }"
                :disabled="!selectedCinemaId"
              >
                Save your cinema
              </Button>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup>

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
  showtimes: {
    type: Array,
    required: true,
  }
});

const isOpen = ref(false);
const searchQuery = ref('');
const selectedCinemaId = ref(null);
const selectedCinema = ref(null);
const selectedDate = ref(new Date());
const cinemaShowtimes = ref([]);
const cinemaShowtimesByDate = ref([]);
const emit = defineEmits(['cinema-selected']);

const { data: cinemas } = await useFetch('http://localhost:3001/Theaters', {});

const filteredCinemas = computed(() => {
  return cinemas.value.filter(cinema => {
    return cinema.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
           cinema.address.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const saveCinemaSelection = () => {
  if (selectedCinemaId.value) {
    const cinema = cinemas.value.find(c => c.id === selectedCinemaId.value);
    selectedCinema.value = cinema;
    cinemaShowtimes.value = props.showtimes.filter(showtime => showtime.theater == selectedCinemaId.value);
    emit('cinema-selected', cinema);
    console.log('cinema showtimes:', cinemaShowtimes.value);
  }
  onDateSelected(selectedDate.value);
  isOpen.value = false;
};

const onDateSelected = (date) => {
  selectedDate.value = date;
  console.log('date:', date.month, date.number);
  cinemaShowtimesByDate.value = cinemaShowtimes.value.filter(showtime => {
    const showtimeDate = new Date(showtime.time);
    console.log('showtimeDate:', showtimeDate.toLocaleString('en-GB', { month: 'short' }), showtimeDate.getDate());
    return showtimeDate.toLocaleString('en-GB', { month: 'short' }) === date.month &&
           showtimeDate.getDate() === parseInt(date.number);
  });
};
</script>
