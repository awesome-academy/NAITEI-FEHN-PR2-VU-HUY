<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <PageTitle>TICKETING</PageTitle>

    <UProgress v-model="progress" color="secondary" class="pb-5" />
    <UBreadcrumb :items="!selectedSeatsData ? breadcrumbItemsStep1 : breadcrumbItemsStep2" color="secondary" />

    <div class="w-full">
      <SeatSelection
        v-if="!pending && !selectedSeatsData"
        :screen="screenData"
        :price="showtimeData.price"
        :occupied="showtimeData.seat_reservations"
        @seats-selected="handleSeatsSelected"
      />

      <TicketSummary
        v-else-if="!pending && selectedSeatsData"
        :summary="selectedSeatsData"
        :showtimeInfo="{
          movieName: movieData.title,
          poster: movieData.poster,
          theater: theaterData.name,
          address: theaterData.address,
          screen: screenData.id
        }"
        @change-seats="handleChangeSeats"
        @confirm-checkout="handleCheckout"
      />

      <div v-else class="text-center text-white py-8">
        Loading...
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const toast = useToast()
const route = useRoute()
const showtimeId = route.query.showtimeId
const { user } = useAuth()

const pending = ref(false)
const progress = ref(0)
const movieData = ref({})
const showtimeData = ref({})
const theaterData = ref({})
const screenData = ref({})
const selectedSeatsData = ref(null)

const breadcrumbItemsStep1 = [
  {
    label: 'Ticketing',
    icon: 'i-solar:ticket-bold'
  },
  {
    label: 'Choosing seats',
    icon: 'i-solar:armchair-outline',
    class: 'text-blue-400'
  }
]

const breadcrumbItemsStep2 = [
  {
    label: 'Ticketing',
    icon: 'i-solar:ticket-bold'
  },
  {
    label: 'Choosing seats',
    icon: 'i-solar:armchair-outline',
  },
  {
    label: 'Checkout',
    icon: 'i-ic:round-shopping-cart-checkout',
    class: 'text-blue-400'
  }
]

const fetchData = async () => {
  pending.value = true
  try {
    const showtimeRes = await $fetch(`http://localhost:3001/Showtimes/${showtimeId}`)
    showtimeData.value = showtimeRes

    const movieRes = await $fetch(`http://localhost:3001/Movies/${showtimeRes.movie_id}`)
    movieData.value = movieRes

    const theaterRes = await $fetch(`http://localhost:3001/Theaters/${showtimeRes.theater_id}`)
    theaterData.value = theaterRes

    screenData.value = getScreenData(theaterRes.screens)


  } catch (err) {
    toast.add({
      title: 'Error',
      description: err.message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
    console.error('Error fetching data:', err)
  } finally {
    pending.value = false
  }
}

const getScreenData = (screens) => {
  return screens.find((screen) => screen.id === showtimeData.value.screen_id) || {};
};

function handleSeatsSelected(data) {
  selectedSeatsData.value = data;
  progress.value = 50
  console.log('Received selected seats:', data);
}

function handleChangeSeats() {
  selectedSeatsData.value = null;
  progress.value = 0
}

async function handleCheckout(data) {
  const now = new Date().toISOString();

  try {
    for (let i = 0; i < selectedSeatsData.value.seatData.length; i++) {
      const seat = selectedSeatsData.value.seatData[i];

      const ticketData = {
        user_id: user.value.id,
        user_name: user.value.name,
        showtime_id: showtimeId,
        seat_code: seat.name,
        status: "pending",
        payment_method: data.paymentMethod,
        price: seat.price,
        type: seat.type,
        created_at: now,
        updated_at: now,
        bill_link: data.paymentMethod === 'credit-card' ? data.billImageLink : null,
      };

      await $fetch('http://localhost:3001/Tickets', {
        method: 'POST',
        body: ticketData,
      });
    }

    const newOccupiedSeats = [
      ...showtimeData.value.seat_reservations,
      ...selectedSeatsData.value.seatIds.map(id => String(id))
    ]

    // Chỗ này code cũng đang không tạo PATCH request được, chưa biết lý do
    // Dùng để update list chỗ ngồi đã đặt
    await axios.patch(`http://localhost:3001/Showtimes/${showtimeId}`), {
      ...showtimeData.value,
      seat_reservations: newOccupiedSeats
    }

    navigateTo('/tickets')

    toast.add({
      title: 'Ticket booked successfully',
      description: `If you have checked out, wait for approval from admin.`,
      color: 'success',
      icon: 'flat-color-icons:ok',
    })
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err.message || 'There were some errors',
      color: 'error',
      icon: 'i-heroicons-x-circle',
    })
  }
}

onMounted(() => {
  fetchData()
})
</script>
