<script setup>
import { NuxtLink } from '#components';
import { useAuth } from '~/composables/useAuth'

const isNavOpen = ref(false);
const isSearchOpen = ref(false);
const query = ref('');

const toast = useToast()
const { isAuthenticated, isAdmin, logout } = useAuth()

const items = ref(!isAdmin.value ?
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/profile'
    }
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
      to: '/statistics'
    },
    {
      label: 'Users Management',
      icon: 'i-clarity:users-solid',
      to: '/users_management'
    },
    {
      label: 'Movies Management',
      icon: 'i-material-symbols:movie-rounded',
      to: '/movies_management'
    },
    {
      label: 'Tickets Management',
      icon: 'i-ion:ticket',
      to: '/tickets_management'
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
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Theaters</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Promotions</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">News</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Contact</NuxtLink>
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
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Movies</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Theaters</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Promotions</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">News</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#" class="hover:text-blue-400 hover:font-semibold">Contact</NuxtLink>
        </li>
        <li class="mt-10">
          <span v-if="isAuthenticated" @click="signOut" class="hover:text-blue-400 hover:font-semibold cursor-pointer">Sign out</span>
          <NuxtLink v-else to="/login" class="hover:text-blue-400 hover:font-semibold">Login</NuxtLink>
        </li>
      </ul>
    </div>

    <div
      v-if="isSearchOpen"
      class="fixed md:absolute md:max-w-md inset-0 md:top-[4rem] md:right-0 md:bottom-auto md:left-auto md:border md:border-gray-300 bg-gray-900 text-white flex flex-col items-center pt-4 md:py-2 z-50"
    >
      <div class="w-full flex justify-between items-center px-4">
        <div class="flex w-full">
          <div class="w-full">
            <input
              v-model="query"
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
          class="p-4  text-blue-400 hover:text-blue-300 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  </header>
</template>
