<template>
  <div class="pt-6">
    <h2 class="text-xl sm:text-2xl font-bold mb-4">Step 1: Select Seats</h2>

    <div class="lg:flex lg:justify-between gap-4">
      <div class="mb-6 lg:mb-0 max-w-2xl lg:max-w-none mx-auto lg:mx-0">
        <div class="bg-gray-800 py-2 px-4 rounded-lg text-white text-center mb-8">
          Screen
        </div>

        <div class="flex justify-center mb-4">
          <div class="flex space-x-4">
            <div class="flex items-center">
              <div class="w-2 h-2 sm:w-3 sm:h-3 md:h-4 md:w-4 bg-gray-300 rounded mr-2"></div>
              <span class="text-xs sm:text-sm md:text-md lg:text-lg">Available</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 sm:w-3 sm:h-3 md:h-4 md:w-4 bg-blue-500 rounded mr-2"></div>
              <span class="text-xs sm:text-sm md:text-md lg:text-lg">Selected</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 sm:w-3 sm:h-3 md:h-4 md:w-4 bg-green-500 rounded mr-2"></div>
              <span class="text-xs sm:text-sm md:text-md lg:text-lg">VIP</span>
            </div>
            <div class="flex items-center">
              <div class="w-2 h-2 sm:w-3 sm:h-3 md:h-4 md:w-4 bg-red-500 rounded mr-2"></div>
              <span class="text-xs sm:text-sm md:text-md lg:text-lg">Occupied</span>
            </div>
          </div>
        </div>

        <div v-if="seats.length" class="w-full m-auto grid gap-2" :style="gridStyle">
          <template v-for="seat in seats" :key="seat.id">
            <div
              class="w-4 h-4 text-[8px] sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center text-xs sm:text-sm rounded transition-colors duration-200"
              :class="getSeatClasses(seat)"
              :style="getSeatPosition(seat)"
              @click="toggleSeatSelection(seat)"
            >
              {{ seat.name }}
            </div>
          </template>
        </div>
        <div v-else class="text-center text-gray-500">
          No seats available.
        </div>
      </div>

      <div class="mt-6 lg:mt-0 lg:flex lg:flex-col lg:justify-end">
        <div class="mb-2">
          <strong>Selected Seats:</strong> {{ selectedSeatNames.join(', ') || 'None' }}
        </div>
        <div class="mb-4">
          <strong>Total:</strong> {{ formatVND(getTotalPrice()) }}
        </div>
        <Button
          class="px-4 py-2 text-white rounded disabled:opacity-50"
          :disabled="!selectedSeats.length"
          @click="proceedToCheckout"
        >
          Continue
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  screen: {
    type: Object,
    default: () => ({ seats: [] }),
  },
  price: {
    type: Object,
    default: () => ({ standard: 0, vip: 0 }),
  },
  occupied: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['seats-selected']);

// Compute seats, setting occupied status based on props.occupied
const seats = computed(() => {
  const seatData = props.screen.seats && props.screen.seats.length ? props.screen.seats : [];
  return seatData.map((seat) => ({
    ...seat,
    price: seat.type === 'vip' ? props.price.vip : props.price.standard,
    occupied: props.occupied.includes(seat.id),
  }));
});

// Calculate grid dimensions based on seat positions
const maxX = computed(() => Math.max(...seats.value.map((seat) => seat.position.x), 1));
const maxY = computed(() => Math.max(...seats.value.map((seat) => seat.position.y), 1));
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${maxY.value}, 1fr)`,
  gridTemplateRows: `repeat(${maxX.value}, 1fr)`,
}));

const selectedSeats = ref([]);
const selectedSeatNames = computed(() => selectedSeats.value.map((seat) => seat.name));

function getSeatPosition(seat) {
  return {
    gridColumn: seat.position.y,
    gridRow: seat.position.x,
  };
}

function getSeatClasses(seat) {
  if (props.occupied.includes(seat.id.toString())) {
    return 'bg-red-500 text-white cursor-not-allowed';
  }
  const isSelected = selectedSeats.value.some((s) => s.id === seat.id);
  if (isSelected) {
    return 'bg-blue-500 text-white cursor-pointer';
  }
  if (seat.type === 'vip') {
    return 'bg-green-500 text-white hover:bg-green-600 cursor-pointer';
  }
  return 'bg-gray-300 text-gray-700 hover:bg-gray-400 cursor-pointer';
}

function toggleSeatSelection(seat) {
  if (props.occupied.includes(seat.id.toString())) return;
  const seatIndex = selectedSeats.value.findIndex((s) => s.id === seat.id);
  if (seatIndex === -1) {
    selectedSeats.value.push(seat);
  } else {
    selectedSeats.value.splice(seatIndex, 1);
  }
}

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

function getTotalPrice() {
  return selectedSeats.value.reduce((total, seat) => total + (seat.price || 0), 0);
}

function proceedToCheckout() {
  const seatIds = selectedSeats.value.map((seat) => seat.id);
  const seatData = selectedSeats.value.map((seat) => {
    return {name: seat.name, price: seat.price, type: seat.type}
  });
  const totalPrice = getTotalPrice();

  emit('seats-selected', {
    seatIds,
    seatData,
    totalPrice,
    hasSelectedSeats: seatIds.length > 0,
  });
}
</script>
