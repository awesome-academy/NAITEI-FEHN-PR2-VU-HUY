<template>
  <div class="min-h-screen flex flex-col bg-[radial-gradient(circle_at_center_top,#0a1c3a,#051122_900px,#051122)]">
    <Header />

    <main class="flex-grow">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<script setup>
</script>
