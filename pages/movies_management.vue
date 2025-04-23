<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '#imports'

const movies = ref([])
const paginatedMovies = ref([])
const pending = ref(true)
const page = ref(1)
const limit = ref(5)
const isModalOpen = ref(false)
const isEditing = ref(false)
const movieForm = ref({
  id: null,
  title: '',
  poster: '',
  trailer: '',
  genre: '',
  release_date: '',
  duration: '',
  status: 'coming-soon',
  casts: [],
  directors: [],
  created_at: '',
  updated_at: ''
})

const toast = useToast()
const totalItems = computed(() => movies.value.length)

const fetchMovies = async () => {
  pending.value = true
  try {
    const res = await $fetch('http://localhost:3001/Movies?_sort=status')
    movies.value = res
    updatePaginatedMovies()
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
    console.error('Error fetching movies:', err)
  } finally {
    pending.value = false
  }
}

const updatePaginatedMovies = () => {
  const start = (page.value - 1) * limit.value
  const end = start + limit.value
  paginatedMovies.value = movies.value.slice(start, end)
}

const openCreateModal = () => {
  isEditing.value = false
  movieForm.value = {
    id: null,
    title: '',
    synopsis: '',
    poster: '',
    trailer: '',
    release_date: '',
    genre: '',
    duration: '',
    casts: [],
    directors: [],
  }
  isModalOpen.value = true
}

const openEditModal = (movie) => {
  console.log(movie.release_date)
  isEditing.value = true
  movieForm.value = { ...movie }
  isModalOpen.value = true
}

const validateForm = () => {
  const errors = []

  if (!movieForm.value.title.trim()) errors.push('Title is required.')
  if (!movieForm.value.poster.trim()) errors.push('Poster URL is required.')
  if (!movieForm.value.trailer.trim()) errors.push('Trailer URL is required.')
  if (!movieForm.value.genre.trim()) errors.push('Genre is required.')
  if (!movieForm.value.duration || isNaN(movieForm.value.duration)) errors.push('Valid duration is required.')
  if (!movieForm.value.release_date) errors.push('Release date is required.')
  if (!movieForm.value.status) errors.push('Status is required.')

  return errors
}

const saveMovie = async () => {
  const errors = validateForm()
  if (errors.length > 0) {
    toast.add({
      title: 'Validation Error',
      description: errors.join('\n'),
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    })
    return
  }

  try {
    if (isEditing.value) {
      movieForm.value.updated_at = new Date().toISOString()
      movieForm.value.status = movieForm.value.status.value
      await $fetch(`http://localhost:3001/Movies/${movieForm.value.id}`, {
        method: 'PUT',
        body: movieForm.value
      })

      const index = movies.value.findIndex(m => m.id === movieForm.value.id)
      if (index !== -1) movies.value[index] = { ...movieForm.value }
    } else {
      const { id, ...movieData } = movieForm.value
      const currentTimestamp = new Date().toISOString()
      movieData.status = movieData.status?.value
      movieData.created_at = currentTimestamp
      movieData.updated_at = currentTimestamp
      const newMovie = await $fetch('http://localhost:3001/Movies', {
          method: 'POST',
          body: movieData
        })

      movies.value.push(newMovie)
    }
    updatePaginatedMovies()
    toast.add({
      title: `${isEditing ? 'Edited' : 'Created'} movie`,
      color: 'success',
      icon: 'flat-color-icons:ok',
    })
  } catch (err) {
      toast.add({
        title: 'There was some error',
        description: err.message,
        color: 'error',
        icon: 'i-heroicons-x-circle',
      })
  } finally {
    isModalOpen.value = false
  }
}

const deleteMovie = async (movieId) => {
  try {
    await $fetch(`http://localhost:3001/Movies/${movieId}`, {
      method: 'DELETE'
    })

    movies.value = movies.value.filter(m => m.id !== movieId)
    updatePaginatedMovies()

    toast.add({
      title: 'Deleted',
      description: 'Movie has been deleted successfully.',
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (err) {
    console.error('Error deleting movie:', err)
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
}

watch(page, updatePaginatedMovies)
onMounted(fetchMovies)
</script>

<template>
  <div class="p-4">
    <PageTitle>MOVIES MANAGEMENT</PageTitle>
    <div v-if="pending" class="text-center text-white py-8">
      Loading...
    </div>

    <div v-else>
      <div class="flex justify-end items-center mb-4">
        <UButton leading-icon="i-line-md:plus" size="md" color="secondary" @click="openCreateModal">Add movie</UButton>
      </div>

      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <form class="bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 relative">
          <h2 class="text-xl font-semibold">
            {{ isEditing ? 'Edit Movie' : 'Create Movie' }}
          </h2>

          <div class="grid grid-cols-2 space-y-3 space-x-3">
            <div class="col-span-2">
              <label class="block text-sm font-medium mb-1">Title</label>
              <UInput v-model="movieForm.title" placeholder="Movie title" color="neutral" class="w-full" required="true" />
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Poster URL</label>
              <UInput v-model="movieForm.poster" type="url" placeholder="https://..." color="neutral" class="w-full" required />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Trailer URL</label>
              <UInput v-model="movieForm.trailer" type="url" placeholder="https://..." color="neutral" class="w-full" required />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Genre</label>
              <UInput v-model="movieForm.genre" placeholder="e.g., Drama" color="neutral" class="w-full" required />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Duration (min)</label>
              <UInput v-model="movieForm.duration" type="number" placeholder="100 mins" color="neutral" class="w-full" required />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1 border-gray-300 focus:outline-none">Release Date</label>
              <UInput v-model="movieForm.release_date" type="date" placeholder="100 mins" color="neutral" class="w-full" required />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Status</label>
              <UInputMenu
                v-model="movieForm.status"
                :items="[
                  {
                    label: 'showing',
                    value: 'showing',
                    chip: {
                      color: 'success'
                    }
                  },
                  {
                    label: 'coming-soon',
                    value: 'coming-soon',
                    chip: {
                      color: 'info'
                    }
                  }, {
                    label: 'ended',
                    value: 'ended',
                    chip: {
                      color: 'neutral'
                    }
                  }]"
                color="neutral"
              />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Casts</label>
              <UInputMenu
                v-model="movieForm.casts"
                create-item
                :items="movieForm?.casts"
                color="neutral"
                multiple=""
                @create="(item) => movieForm.casts.push(item)"
              />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium mb-1">Directors</label>
              <UInputMenu
                v-model="movieForm.directors"
                create-item
                :items="movieForm?.directors"
                color="neutral"
                multiple=""
                @create="(item) => movieForm.directors.push(item)"
              />
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium mb-1">Synopsis</label>
              <textarea v-model="movieForm.synopsis" placeholder="This is a movie about..." class="w-full border rounded px-3 py-2" />
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <UButton color="neutral" class="rounded-lg" @click="() => isModalOpen = false">Cancel</UButton>
            <UButton color="secondary" class="rounded-lg" @click.prevent="saveMovie">
              {{ isEditing ? 'Update' : 'Create' }}
            </UButton>
          </div>

          <button @click="() => isModalOpen = false" class="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold">
            &times;
          </button>
        </form>
      </div>

      <table class="min-w-full rounded-lg shadow-sm text-white text-sm">
        <thead>
          <tr>
            <th class="text-left p-3 border-b">Title</th>
            <th class="text-center p-3 border-b">Poster</th>
            <th class="text-left p-3 border-b">Genre</th>
            <th class="text-center p-3 border-b">Duration (min)</th>
            <th class="text-center p-3 border-b">Status</th>
            <th class="text-center p-3 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in paginatedMovies" :key="movie.id" class="border-b hover:bg-gray-800">
            <td class="p-3">
              <NuxtLink :to="`/movie/${movie.id}`" class="hover:text-blue-400">
                {{ movie.title }}
              </NuxtLink>
            </td>
            <td class="p-3 flex items-center justify-center">
              <img :src="movie.poster" :alt="`${movie.title} poster`" class="h-16 w-auto rounded" />
            </td>
            <td class="p-3">{{ movie.genre }}</td>
            <td class="p-3 text-center">{{ movie.duration }} minutes</td>
            <td class="p-3 text-center">{{ movie.status }}</td>
            <td class="p-3 text-center">
              <UDropdownMenu
                :ui="{ content: 'w-20' }"
                :items="[
                  {
                    label: 'Showtimes',
                    icon: 'material-symbols:calendar-clock-outline',
                    to: '/movies/showtimes'
                  },
                  {
                    label: 'Edit',
                    icon: 'i-lucide-pencil',
                    onSelect() {
                      openEditModal(movie)
                    }
                  },
                  {
                    label: 'Delete',
                    color: 'error',
                    icon: 'i-lucide-trash',
                    onSelect() {
                      deleteMovie(movie.id)
                    }
                  }
                ]"
                :content="{align: 'end'}"
              >
                <UButton color="neutral" variant="outline" icon="iwwa:option" class="rounded-full" />
              </UDropdownMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="page"
        :total="totalItems"
        :items-per-page="5"
        :disabled="pending"
        active-color="secondary"
      />
    </div>
  </div>
</template>
