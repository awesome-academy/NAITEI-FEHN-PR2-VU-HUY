<template>
  <footer class="bg-[rgb(10,28,58)] text-white py-6">
    <div class="container mx-auto max-w-6xl px-4">
      <ul class="grid grid-cols-2 md:grid-cols-4 space-y-12 md:space-y-0 space-x-6 md:space-x-12 text-sm mb-4">
        <div class="col flex flex-col space-y-2">
          <li><NuxtLink to="/" class="hover:opacity-70">Cookie Policy</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Privacy and Legal</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Corporate Responsibility</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Modern Slavery Statement</NuxtLink></li>
        </div>
        <div class="col flex flex-col space-y-2">
          <li><NuxtLink to="/" class="hover:opacity-70">Contact us</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Help</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Accessibility</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Allergens</NuxtLink></li>
        </div>
        <div class="col flex flex-col space-y-2">
          <li><NuxtLink to="/" class="hover:opacity-70">About us</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Careers</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Corporate Events</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">ODEON Scene</NuxtLink></li>
        </div>
        <div class="col flex flex-col space-y-2">
          <li><NuxtLink to="/" class="hover:opacity-70">iOS App</NuxtLink></li>
          <li><NuxtLink to="/" class="hover:opacity-70">Android App</NuxtLink></li>
        </div>
        <li class="md:hidden col-span-2 flex items-center justify-center">
          <NuxtLink to="/" class="font-bold text-3xl font-mono">ODEON</NuxtLink>
        </li>
      </ul>

      <div class="absolute left-0 w-screen h-px bg-black"></div>

      <div class="flex items-center justify-between mt-10">
        <p class="hidden md:block">© ODEON Cinemas Limited 2019 to 2025. All rights reserved.</p>
        <ul class="w-full md:w-auto flex items-center justify-center space-x-4">
          <li>
            <NuxtLink to="#">
              <Icon name="entypo-social:facebook-with-circle" size="28px" class="hover:text-blue-400"/>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#">
              <Icon name="ri:twitter-x-fill" size="28px" class="hover:text-gray-500"/>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#">
              <Icon name="hugeicons:instagram" size="28px" class="hover:text-rose-400"/>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#">
              <Icon name="iconoir:tiktok" size="28px" class="hover:text-gray-500"/>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#">
              <Icon name="mingcute:youtube-fill" size="28px" class="hover:text-red-500"/>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <p class="mt-4 md:hidden">© ODEON Cinemas Limited 2019 to 2025. All rights reserved.</p>
    </div>
  </footer>
</template>
