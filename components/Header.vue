<script setup>
import { NuxtLink } from '#components';
import { useAuth } from '~/composables/useAuth'

const isNavOpen = ref(false);
const isSearchOpen = ref(false);
const query = ref('');
const searchResults = ref([]);
const isLoading = ref(false);

const toast = useToast()
const { isAuthenticated, isAdmin, logout } = useAuth()

let debounceTimer = null;

const handleSearchInput = () => {
  // Clear any existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  
  debounceTimer = setTimeout(async () => {
    if (query.value.length > 1) {
      await fetchSearchResults();
    } else {
      searchResults.value = [];
    }
  }, 500);
};

// Function to fetch search results
const fetchSearchResults = async () => {
  try {
    isLoading.value = true;
    console.log('url:', `http://localhost:3001/Movies?title_like=${encodeURIComponent(query.value)}`); 
    const response = await fetch(`http://localhost:3001/Movies?title_like=${encodeURIComponent(query.value)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    
    const data = await response.json() || [];
    console.log('data:', data);
    searchResults.value = data;
    console.log('searchResults:', searchResults.value);
  } catch (error) {
    console.error('Failed to fetch search results:', error);
    toast.add({
      title: 'Search failed',
      description: 'Unable to fetch search results',
      color: 'error',
      icon: 'i-heroicons-exclamation-circle',
    });
  } finally {
    isLoading.value = false;
  }
};

const navigateToMovie = (movieId) => {
  toggleSearch();
  navigateTo(`/movie/${movieId}`);
};

const items = ref(!isAdmin.value ?
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: 'Your tickets',
      icon: 'i-ion:ticket',
      to: '/tickets/'
    },
  ] :
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile'
    },
    {
      label: 'Statistics',
      icon: 'i-solar:chart-2-bold',
      to: '/admin/statistics'
    },
    {
      label: 'Users Management',
      icon: 'i-clarity:users-solid',
      to: '/admin/users_management'
    },
    {
      label: 'Movies Management',
      icon: 'i-material-symbols:movie-rounded',
      to: '/admin/movies_management'
    },
    {
      label: 'Tickets Management',
      icon: 'i-ion:ticket',
      to: '/admin/tickets_management'
    },
  ]
)

const toggleMobileNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
};

const resetQuery = () => {
  query.value = '';
  searchResults.value = [];
}

const signOut = () => {
  logout()
  toast.add({
    title: 'Sign out successfully',
    description: `Signed out.`,
    color: 'success',
    icon: 'flat-color-icons:ok',
  })
  navigateTo('/login')
}

const formatReleaseDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
</script>

<template>
  <header :key="isAuthenticated" class="text-white">
    <nav class="container mx-auto max-w-6xl px-4 py-4 flex justify-between items-center">
      <div class="flex items-center justify-center md:hidden">
        <Icon
          name="material-symbols:search"
          size="28px"
          class="hover:opacity-70 cursor-pointer"
          @click="toggleSearch"
        />
      </div>
      <NuxtLink to="/" class="font-bold text-3xl font-mono">ODEON</NuxtLink>

      <ul class="hidden md:flex items-start p-4 md:space-x-8 lg:space-x-10">
        <li>
          <NuxtLink to="/movies" class="hover:text-blue-400 hover:font-semibold">Movies</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/cinemas" class="hover:text-blue-400 hover:font-semibold">Theaters</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/promotions" class="hover:text-blue-400 hover:font-semibold">Promotions</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/news" class="hover:text-blue-400 hover:font-semibold">News</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact" class="hover:text-blue-400 hover:font-semibold">Contact</NuxtLink>
        </li>
      </ul>

      <div class="flex justify-center items-center">
        <ClientOnly>
          <NuxtLink
            v-if="!isAuthenticated"
            to="/login"
            class="hidden md:block mr-2 hover:text-blue-400 hover:font-semibold"
          >
            Login
          </NuxtLink>
          <div v-else class="flex items-center">
            <UDropdownMenu
              :items="items"
              :content="{
                align: 'end',
                side: 'bottom',
                sideOffset: 8
              }"
              :ui="{
                content: 'w-48'
              }"
            >
              <UAvatar
                src="../public/avatar-placeholder.png"
                icon="material-symbols:person"
                size="md"
                class="mr-3 cursor-pointer"
              />
            </UDropdownMenu>
            <span @click="signOut" class="hidden md:block cursor-pointer mr-2 hover:text-blue-400 hover:font-semibold">Sign out</span>
          </div>
        </ClientOnly>

        <div class="hidden md:flex items-center justify-center">
          <Icon
          name="material-symbols:search"
          size="28px"
          class="hover:opacity-70 cursor-pointer"
          @click="toggleSearch"
          />
        </div>

        <button @click="toggleMobileNav" class="md:hidden flex justify-center items-center focus:outline-none">
          <Icon :name="isNavOpen ? 'akar-icons:cross' : 'akar-icons:three-line-horizontal'" size="28px" class="hover:text-blue-400 cursor-pointer" />
        </button>
      </div>
    </nav>

    <div
      v-if="isNavOpen"
      class="absolute top-[4rem] bg-[radial-gradient(circle_at_center_top,#0a1c3a,#051122_900px,#051122)] left-0 md:hidden w-full text-white shadow-md z-10"
    >
      <ul class="flex flex-col items-start p-4 space-y-10">
        <li>
          <NuxtLink to="/movies" class="hover:text-blue-400 hover:font-semibold">Movies</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/cinemas" class="hover:text-blue-400 hover:font-semibold">Theaters</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/promotions" class="hover:text-blue-400 hover:font-semibold">Promotions</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/news" class="hover:text-blue-400 hover:font-semibold">News</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/contact" class="hover:text-blue-400 hover:font-semibold">Contact</NuxtLink>
        </li>
        <li class="mt-10">
          <span v-if="isAuthenticated" @click="signOut" class="hover:text-blue-400 hover:font-semibold cursor-pointer">Sign out</span>
          <NuxtLink v-else to="/login" class="hover:text-blue-400 hover:font-semibold">Login</NuxtLink>
        </li>
      </ul>
    </div>

    <div
      v-if="isSearchOpen"
      class="fixed md:absolute md:max-w-xl inset-0 md:top-[4rem] md:bottom-auto md:left-[50%] md:border md:border-gray-700 bg-gray-900 text-white flex flex-col items-center pt-4 md:py-2 z-50"
    >
      <div class="w-full flex justify-between items-center px-4">
        <div class="flex w-full">
          <div class="w-full">
            <input
              v-model="query"
              @input="handleSearchInput"
              type="text"
              placeholder="Type here to search"
              class="w-full bg-transparent text-white placeholder-gray-400 border-b border-gray-500 focus:outline-none py-2"
            />
          </div>
          <button @click="resetQuery" class="flex items-center ml-4 focus:outline-none">
            <Icon name="akar-icons:cross" size="24px" />
          </button>
        </div>

        <button
          @click="toggleSearch"
          class="p-4 text-blue-400 hover:text-blue-300 focus:outline-none"
        >
          Cancel
        </button>
      </div>

      <!-- Search results -->
      <div class="w-full overflow-y-auto max-h-[80vh] mt-2">
        <div v-if="isLoading" class="flex justify-center py-4">
          <Icon name="eos-icons:loading" size="24px" class="animate-spin" />
        </div>
        
        <div v-else-if="searchResults.length > 0" class="p-2">
          <div v-for="movie in searchResults" :key="movie.id" 
               @click="navigateToMovie(movie.id)"
               class="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded">
            <div class="w-16 h-24 mr-3">
              <img :src="movie.poster || '/movie-placeholder.png'" :alt="movie.title" class="w-full h-full object-cover rounded">
            </div>
            <div class="flex flex-col">
              <p class="font-semibold">{{ movie.title }}</p>
              <div class="flex items-center text-xs text-gray-400 mt-1">
                <span v-if="movie.release_date" class="mx-2">{{ formatReleaseDate(movie.release_date) }}</span>
                <span class="mx-1">•</span>
                <span v-if="movie.duration" class="mx-2">{{ movie.duration }}'</span>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else-if="query && query.length > 1" class="p-4 text-center text-gray-400">
          No movies found
        </div>
      </div>
    </div>
  </header>
</template>
