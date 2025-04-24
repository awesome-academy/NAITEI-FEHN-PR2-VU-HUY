<!-- components/ShowtimeItem.vue -->
<template>
  <div class="relative rounded-lg"
    :class="{
      'border border-white ': !hasSpecialAmenities,
      'border border-pink-500 ': hasSpecialAmenities,
    }"
  >
    <div class="bg-[#051122] text-white p-3 flex rounded-lg justify-between items-center">
      <div>
        <p class="text-xl font-bold">{{ formatShowtime(time) }}</p>
        <p class="text-xs">SCREEN {{ screen }}</p>
      </div>
    </div>
    
    <div v-if="hasSpecialAmenities" class="absolute right-0 top-0 bottom-0 w-7 bg-pink-500 flex flex-col rounded-r-lg justify-center items-center">
      <div class="writing-vertical text-md whitespace-nowrap rotate-90"> {{ specialAmenities }}</div>
    </div>
    
    <button class="w-full mt-2 bg-blue-600 rounded-b-lg py-2">
      Book Now
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  time: {
    type: String,
    required: true
  },
  screen: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: ''
  }


});

const formatShowtime = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const hasSpecialAmenities = computed(() => {
  return props.type.includes('3D') || props.type.includes('IMAX');
});

const specialAmenities = computed(() => {
  if ( props.type.includes('3D') && props.type.includes('IMAX')) {
    return "3D & IMAX";
  } else if (props.type.includes('3D')) {
    return "3D";
  } else if (props.type.includes('IMAX')) {
    return "IMAX";
  }
});
</script>

<style scoped>
.writing-vertical {
  transform-origin: center;
}
</style>
