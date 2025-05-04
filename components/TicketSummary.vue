<template>
  <div class="pt-6">
    <h2 class="text-xl sm:text-2xl font-bold mb-4">Step 2: Checkout</h2>

    <div v-if="summary.hasSelectedSeats" class="mb-6">
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row gap-4">
          <div>
            <div v-if="showtimeInfo.poster" class="flex-shrink-0 flex items-center justify-center">
              <img
                :src="showtimeInfo.poster"
                alt="Movie Poster"
                class="w-full max-w-[150px] sm:max-w-[250px] h-auto rounded-lg shadow"
              />
            </div>
            <div v-else class="flex-shrink-0">
              <div class="w-full md:w-[200px] h-[225px] md:h-[300px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No poster available
              </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-6">{{ showtimeInfo.movieName || 'Unknown' }}</h3>
          </div>

          <div class="sm:w-full">
            <p class="mb-2"><strong>Address:</strong> {{ showtimeInfo.address || 'Unknown' }}</p>
            <p class="mb-2"><strong>Theater:</strong> Screen {{ showtimeInfo.screen || 'Unknown' }}, {{ showtimeInfo.theater || 'Unknown' }}</p>
            <p class="mb-2"><strong>Seats: </strong> {{ summary.seatData.map((seat) => seat.name).join(', ') }}</p>

            <div class="mb-4">
              <h3 class="text-lg font-bold mb-2">Payment Method</h3>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="paymentMethod"
                    value="cash"
                    class="mr-2"
                  />
                  <span>Cash</span>
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="paymentMethod"
                    value="credit-card"
                    class="mr-2"
                  />
                  <span>Credit Card</span>
                </label>
              </div>
            </div>

            <!-- Bill Image Link for Credit Card -->
            <div v-show="paymentMethod === 'credit-card'" class="mb-4">
              <label for="billImageLink" class="block text-sm font-medium mb-2 text-gray-100">
                Bill Image Link
              </label>
              <UInput
                v-model="billImageLink"
                type="url"
                placeholder="https://example.com/bill.jpg"
                color="secondary"
                class="w-full"
                leading-icon="ic:outline-link"
              />
            </div>

            <div class="mb-6">
              <p class="mb-2"><strong>Total Price:</strong> {{ formatVND(summary.totalPrice) }}</p>
            </div>

            <div class="flex gap-10">
              <Button
                class="px-4 py-2"
                @click="changeSeats"
              >
                Change seats
              </Button>

              <Button
                class="px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!isCheckoutValid"
                @click="confirmCheckout"
              >
                Confirm
              </Button>
            </div>

          </div>
        </div>
      </div>

    </div>
    <div v-else class="text-center text-gray-500">
      No seats selected.
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({
      seatData: [{name: ''}],
      totalPrice: 0,
      hasSelectedSeats: false,
    }),
  },
  showtimeInfo: {
    type: Object,
    default: () => ({
      movieName: '',
      poster: '',
      theater: '',
      address: '',
      screen: '',
    }),
  },
});

const emit = defineEmits(['confirm-checkout', 'change-seats']);

const paymentMethod = ref('cash');
const billImageLink = ref('');

// Validate checkout (require bill image link for credit card)
const isCheckoutValid = computed(() => {
  if (paymentMethod.value === 'cash') return true;
  return !!billImageLink.value; // Require non-empty link for credit card
});

function formatVND(amount) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
}

function confirmCheckout() {
  const checkoutData = {
    paymentMethod: paymentMethod.value,
    billImageLink: paymentMethod.value === 'credit-card' ? billImageLink.value : null,
  };
  emit('confirm-checkout', checkoutData);
}

function changeSeats() {
  emit('change-seats');
}
</script>
