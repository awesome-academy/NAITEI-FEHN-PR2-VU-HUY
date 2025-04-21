<template>
  <div class="min-h-screen flex flex-col bg-[radial-gradient(circle_at_center_top,#0a1c3a,#051122_900px,#051122)]">
    <Header />

    <main class="flex-grow container max-w-6xl mx-auto px-4 py-8">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
</script>
