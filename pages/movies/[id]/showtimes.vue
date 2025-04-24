<template>
  <div class="max-w-6xl mx-auto px-4">
    <PageTitle>SHOWTIMES</PageTitle>
    <p v-if="loading" class="text-center">Loading...</p>
    <div v-else>
      <h3 class="py-2 font-bold text-lg text-center">Movie: {{ fetchedMovie?.title }}</h3>
      <form @submit.prevent="handleSubmit">
        <div v-if="fetchError" class="text-red-500 mb-4">
          Error fetching data: {{ fetchError }}
        </div>
        <div v-if="submitError" class="text-red-500 mb-4">
          Error submitting showtimes: {{ submitError }}
        </div>
        <div class="space-y-4">
          <div v-for="(theater, theaterIndex) in theaters" :key="theater.id" class="grid grid-cols-3 gap-6">
            <!-- Theater Column -->
            <div class="col-span-1 space-y-2">
              <label for="theater" class="block text-sm font-medium text-white">Theater</label>
              <UInputMenu
                v-model="theater.selectedTheater"
                :items="availableTheaterOptions(theaterIndex)"
                placeholder="Select Theater"
                color="secondary"
                class="w-full invalid:border-red-500"
                required
              />
              <UButton
                v-if="theaters.length > 1"
                icon="i-heroicons-trash"
                color="error"
                variant="outline"
                @click="removeTheater(theaterIndex)"
              />
            </div>

            <!-- Screen and Showtime Columns -->
            <div class="space-y-4 col-span-2">
              <div v-if="theater.selectedTheater" class="space-y-4">
                <div v-for="(screen, screenIndex) in theater.screens" :key="screen.id" class="grid grid-cols-2 gap-2">
                  <!-- Screen Selection -->
                  <div class="space-y-2">
                    <label for="screen" class="block text-sm font-medium text-white">Screen</label>
                    <UInputMenu
                      v-model="screen.selectedScreen"
                      :items="availableScreenOptions(theaterIndex, screenIndex)"
                      placeholder="Select Screen"
                      color="secondary"
                      class="w-full invalid:border-red-500"
                      required
                    />
                    <UButton
                      v-if="theater.screens.length > 1"
                      icon="i-heroicons-trash"
                      color="error"
                      variant="outline"
                      @click="removeScreen(theaterIndex, screenIndex)"
                    />
                  </div>

                  <!-- Showtime Column -->
                  <div class="space-y-4">
                    <div v-if="screen.selectedScreen" class="space-y-4">
                      <div v-for="(showtime, showtimeIndex) in screen.showtimes" :key="showtime.id" class="space-y-2">
                        <div class="space-y-2">
                          <label for="dateTime" class="block text-sm font-medium text-white">Date & Time</label>
                          <UInput
                            v-model="showtime.dateTime"
                            type="datetime-local"
                            placeholder="Select Date & Time"
                            color="secondary"
                            class="w-full invalid:border-red-500"
                            required
                          />
                        </div>
                        <div class="flex gap-2">
                          <div class="space-y-2">
                            <label for="normalPrice" class="block text-sm font-medium text-white">Normal Price</label>
                            <UInput
                              v-model.number="showtime.normalPrice"
                              type="number"
                              placeholder="Normal Price"
                              color="secondary"
                              class="w-full invalid:border-red-500"
                              min="0"
                              required
                            />
                          </div>
                          <div class="space-y-2">
                            <label for="vipPrice" class="block text-sm font-medium text-white">VIP Price</label>
                            <UInput
                              v-model.number="showtime.vipPrice"
                              type="number"
                              color="secondary"
                              placeholder="VIP Price"
                              class="w-full invalid:border-red-500"
                              min="0"
                              required
                            />
                          </div>
                        </div>
                        <UButton
                          v-if="screen.showtimes.length > 1"
                          icon="i-heroicons-trash"
                          color="error"
                          variant="outline"
                          @click="removeShowtime(theaterIndex, screenIndex, showtimeIndex)"
                        />
                      </div>
                      <UButton
                        icon="i-heroicons-plus"
                        color="secondary"
                        variant="outline"
                        @click="addShowtime(theaterIndex, screenIndex)"
                      />
                    </div>
                  </div>
                </div>
                <UButton
                  icon="i-heroicons-plus"
                  color="secondary"
                  variant="outline"
                  @click="addScreen(theaterIndex)"
                />
              </div>
            </div>
          </div>
          <UButton
            leading-icon="i-heroicons-plus"
            color="secondary"
            variant="outline"
            @click="addTheater"
          >Add more theater</UButton>
        </div>

        <!-- Submit Button -->
        <div class="mt-6 flex justify-end gap-2">
          <UButton
            to="/movies_management"
            color="neutral"
            variant="solid"
            label="Cancel"
          />
          <UButton
            type="submit"
            color="info"
            variant="solid"
            label="Save"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const toast = useToast()
const route = useRoute()
const movieId = route.params.id

const loading = ref(true)
const fetchedTheaters = ref([])
const fetchedMovie = ref(null)
const currentShowtimes = ref([])
const fetchError = ref(null)
const submitError = ref(null)

const theaters = ref([])

onMounted(async () => {
  try {
    // Fetch theaters
    const theaterResponse = await axios.get('http://localhost:3001/Theaters')
    fetchedTheaters.value = theaterResponse.data

    // Fetch movie details
    const movieResponse = await axios.get(`http://localhost:3001/Movies/${movieId}`)
    fetchedMovie.value = movieResponse.data

    // Fetch showtimes for current movie
    const showtimeResponse = await axios.get(`http://localhost:3001/Showtimes?movie_id=${movieId}&_sort=theater_name`)
    currentShowtimes.value = showtimeResponse.data

    // Populate theaters with existing showtimes
    if (currentShowtimes.value.length > 0) {
      const theaterMap = new Map()

      // Group showtimes by theater_id and screen_id
      currentShowtimes.value.forEach(showtime => {
        const theaterId = showtime.theater_id
        const screenId = showtime.screen_id

        // Initialize theater if not exists
        if (!theaterMap.has(theaterId)) {
          const theaterData = fetchedTheaters.value.find(t => t.id === theaterId)
          if (theaterData) {
            theaterMap.set(theaterId, {
              id: theaterId,
              selectedTheater: theaterData.name,
              screens: new Map()
            })
          }
        }

        // Initialize screen if not exists
        const theater = theaterMap.get(theaterId)
        if (theater && !theater.screens.has(screenId)) {
          theater.screens.set(screenId, {
            id: screenId,
            selectedScreen: screenId.toString(),
            showtimes: []
          })
        }

        // Add showtime to screen
        const screen = theater?.screens.get(screenId)
        if (screen) {
          screen.showtimes.push({
            id: showtime.id || uuidv4(), // Use backend ID if available, else UUID
            dateTime: showtime.showtime,
            normalPrice: showtime.price.standard,
            vipPrice: showtime.price.vip
          })
        }
      })

      // Convert Map to array for theaters
      theaters.value = Array.from(theaterMap.values()).map(theater => ({
        ...theater,
        screens: Array.from(theater.screens.values())
      }))
    }

    // If no showtimes, initialize with default empty structure
    if (theaters.value.length === 0) {
      theaters.value = [
        {
          id: 0,
          selectedTheater: null,
          screens: [
            {
              id: 0,
              selectedScreen: null,
              showtimes: [
                {
                  id: uuidv4(),
                  dateTime: '',
                  normalPrice: 0,
                  vipPrice: 0
                }
              ]
            }
          ]
        }
      ]
    }
  } catch (error) {
    fetchError.value = error.message || 'Failed to fetch data'
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
})

// Compute theater options from fetched data
const theaterOptions = computed(() => {
  return fetchedTheaters.value.map(theater => theater.name)
})

// Compute screen options based on selected theater
const screenOptions = (theaterName) => {
  const theater = fetchedTheaters.value.find(t => t.name === theaterName)
  return theater ? theater.screens.map(screen => screen.id.toString()) : []
}

// Compute available theater options by excluding already selected theaters
const availableTheaterOptions = (currentTheaterIndex) => {
  const selectedTheaters = theaters.value
    .filter((_, index) => index !== currentTheaterIndex)
    .map((theater) => theater.selectedTheater)
    .filter(Boolean)
  return theaterOptions.value.filter((option) => !selectedTheaters.includes(option))
}

// Compute available screen options by excluding already selected screens in the same theater
const availableScreenOptions = (theaterIndex, currentScreenIndex) => {
  const selectedTheater = theaters.value[theaterIndex].selectedTheater
  const selectedScreens = theaters.value[theaterIndex].screens
    .filter((_, index) => index !== currentScreenIndex)
    .map((screen) => screen.selectedScreen)
    .filter(Boolean)
  return screenOptions(selectedTheater).filter((option) => !selectedScreens.includes(option))
}

const addTheater = () => {
  theaters.value.push({
    id: 0, // Temporary ID
    selectedTheater: null,
    screens: [
      {
        id: 0, // Temporary ID
        selectedScreen: null,
        showtimes: [
          {
            id: uuidv4(),
            dateTime: '',
            normalPrice: 0,
            vipPrice: 0
          }
        ]
      }
    ]
  })
}

const addScreen = (theaterIndex) => {
  theaters.value[theaterIndex].screens.push({
    id: 0, // Temporary ID
    selectedScreen: null,
    showtimes: [
      {
        id: uuidv4(),
        dateTime: '',
        normalPrice: 0,
        vipPrice: 0
      }
    ]
  })
}

const addShowtime = (theaterIndex, screenIndex) => {
  theaters.value[theaterIndex].screens[screenIndex].showtimes.push({
    id: uuidv4(),
    dateTime: '',
    normalPrice: 0,
    vipPrice: 0
  })
}

const removeTheater = (theaterIndex) => {
  theaters.value.splice(theaterIndex, 1)
}

const removeScreen = (theaterIndex, screenIndex) => {
  theaters.value[theaterIndex].screens.splice(screenIndex, 1)
}

const removeShowtime = (theaterIndex, screenIndex, showtimeIndex) => {
  theaters.value[theaterIndex].screens[screenIndex].showtimes.splice(showtimeIndex, 1)
}

// Handle form submission
const handleSubmit = async () => {
  if (!fetchedMovie.value) {
    submitError.value = 'Movie data not loaded'
    toast.add({
      title: 'Update Failed',
      description: 'Movie data not loaded',
      color: 'error',
      icon: 'flat-color-icons:cancel'
    })
    return
  }

  submitError.value = null
  loading.value = true

  try {
    for (const theater of theaters.value) {
      const theaterData = fetchedTheaters.value.find(t => t.name === theater.selectedTheater)
      if (!theaterData) continue // Skip if theater not found

      for (const screen of theater.screens) {
        if (!screen.selectedScreen) continue // Skip if no screen selected

        for (const showtime of screen.showtimes) {
          if (!showtime.dateTime) continue // Skip if no dateTime

          const showtimeData = {
            movie_id: movieId,
            movie_name: fetchedMovie.value.title,
            screen_id: parseInt(screen.selectedScreen),
            showtime: showtime.dateTime,
            price: {
              standard: showtime.normalPrice,
              vip: showtime.vipPrice
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            seat_reservations: [],
            theater_id: theaterData.id,
            theater_name: theaterData.name
          }

          // Check if showtime exists in currentShowtimes
          const existingShowtime = currentShowtimes.value.find(
            st =>
              st.theater_id === theaterData.id &&
              st.screen_id === parseInt(screen.selectedScreen) &&
              st.showtime === showtime.dateTime
          )

          if (existingShowtime && existingShowtime.id) {
            // Update existing showtime with PATCH
            await axios.patch(`http://localhost:3001/Showtimes/${existingShowtime.id}`, {
              ...showtimeData,
              updated_at: new Date().toISOString()
            })
          } else {
            // Create new showtime with POST
            const response = await axios.post('http://localhost:3001/Showtimes', showtimeData)
            // Update currentShowtimes to include new showtime
            currentShowtimes.value.push(response.data)
          }
        }
      }
    }

    // Show success toast
    toast.add({
      title: 'Showtimes updated successfully',
      color: 'success',
      icon: 'flat-color-icons:ok'
    })
  } catch (error) {
    submitError.value = error.message || 'Failed to submit showtimes'
    toast.add({
      title: 'Showtimes update failed',
      description: submitError.value,
      color: 'error',
      icon: 'flat-color-icons:cancel'
    })
    console.error('Error submitting showtimes:', error)
  } finally {
    loading.value = false
  }
}
</script>
