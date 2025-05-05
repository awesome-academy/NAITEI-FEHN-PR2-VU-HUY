<template>
  <div v-if="loading" class="text-center text-white py-8">
    Loading...
  </div>
  <div v-else>
    <div class="mb-4 flex justify-end">
      <UInput
        v-model="searchQuery"
        placeholder="Search by Ticket ID or User Name..."
        class="w-full max-w-md"
        icon="i-heroicons-magnifying-glass"
        size="md"
        color="white"
      />
    </div>
    <div class="w-full border-white border shadow-md rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="text-white">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
              <th v-if="showTicketsAction" class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Movie</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Seat</th>
              <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Payment</th>
              <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">{{ showTicketsAction ? 'Actions' : 'Bill Image' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 text-gray-100">
            <tr
              v-if="paginatedTickets && paginatedTickets.length"
              v-for="ticket in paginatedTickets"
              :key="ticket.id"
              class="hover:bg-gray-600 text-xs"
            >
              <td class="px-6 py-4 whitespace-nowrap">{{ ticket.id }}</td>
              <td v-if="showTicketsAction" class="px-6 py-4 whitespace-nowrap font-medium">{{ ticket.user_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ ticket.movie_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap space-y-1">
                <div>
                  Ticket type: {{ ticket.type }}
                </div>
                <div>
                  {{ formatShowtime(ticket.showtime) }}
                </div>
                <div>
                  {{ ticket.seat_code }}, Screen
                  {{ ticket.screen }},
                  {{ ticket.theater }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span :class="getStatusClass(ticket.status)">
                  {{ ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatPaymentMethod(ticket.payment_method) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatPrice(ticket.price) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right font-mactionedium">
                <div class="flex items-center justify-center space-x-2">
                  <UButton
                    v-if="showTicketsAction && ticket.status === 'pending'"
                    icon="i-el:ok-sign"
                    size="sm"
                    variant="solid"
                    class="flex items-center justify-center cursor-pointer text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 rounded-full"
                    @click="updateStatus(ticket, 'confirmed')"
                  />
                  <UButton
                    v-if="showTicketsAction && ticket.status === 'pending'"
                    icon="i-healthicons:no-24px"
                    size="sm"
                    variant="solid"
                    @click="updateStatus(ticket, 'cancelled')"
                    class="flex items-center justify-center cursor-pointer text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 rounded-full"
                  />
                  <p v-if="!isAdmin && !ticket.bill_link" class="text-xs text-center">No image</p>
                  <!-- Bill Image Modal -->
                  <UModal v-model="isBillModalOpen" :ui="{ width: 'max-w-3xl' }">
                    <UButton
                      v-if="ticket?.bill_link"
                      icon="i-mdi:eye"
                      size="sm"
                      variant="solid"
                      @click="openBillImage(ticket?.bill_link)"
                      class="flex items-center justify-center cursor-pointer text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-full"
                    />

                    <template #content>
                      <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                          <h2 class="text-lg font-semibold text-gray-100">Bill Image</h2>

                        </div>
                        <div class="flex flex-col space-y-2 justify-center">
                          <img
                            v-if="currentBillImage"
                            :src="currentBillImage"
                            alt="Bill Image"
                            class="max-h-[500px] object-contain rounded-lg"
                            @error="handleImageError"
                          />
                          <div v-else class="text-center text-gray-400">
                            No image available
                          </div>

                          <UModal v-if="ticket.user_id === user.id" v-model="isBillModalOpen" :ui="{ width: 'max-w-3xl' }" close-icon="i-lucide-arrow-right">
                            <div class="flex items-center justify-center">
                              <UButton
                                trailing-icon="solar:pen-bold"
                                variant="solid"
                                class="flex items-center justify-center cursor-pointer text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 rounded-full"
                              >Edit</UButton>
                            </div>

                            <template #content>
                              <div class="p-3">
                                <label for="billImageLink" class="block text-sm font-medium mb-2 text-gray-100">
                                  Bill Image Link
                                </label>
                                <UInput
                                  v-model="currentBillImage"
                                  type="url"
                                  placeholder="https://example.com/bill.jpg"
                                  color="secondary"
                                  class="w-full"
                                  leading-icon="ic:outline-link"
                                />
                                <UButton
                                  variant="solid"
                                  color="secondary"
                                  @click="changeBillImage(ticket.id)"
                                  class="cursor-pointer mt-4 rounded-full"
                                >OK</UButton>
                              </div>
                            </template>
                          </UModal>

                        </div>
                      </div>
                    </template>
                  </UModal>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedTickets.length === 0">
              <td colspan="8" class="px-6 py-4 text-center">No tickets found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="my-4 flex justify-center">
      <UPagination
        v-model:page="currentPage"
        :total="filteredTickets.length"
        :items-per-page="pageSize"
        active-color="secondary"
      />
    </div>
  </div>
</template>

<script setup>
const { isAdmin, user } = useAuth()
const tickets = ref([]);
const showtimes = ref({});
const loading = ref(true);
const error = ref(null);
const updating = ref(null);
const currentPage = ref(1);
const pageSize = 5;
const searchQuery = ref('');
const isBillModalOpen = ref(false)
const currentBillImage = ref(null)

const route = useRoute();
const toast = useToast();

const showTicketsAction = computed(() => isAdmin && route.path === '/admin/tickets_management');

const enhancedTickets = computed(() => {
  return tickets.value.map(ticket => {
    const showtimeData = showtimes.value[ticket.showtime_id];
    return {
      ...ticket,
      movie_name: showtimeData?.movie_name || 'Unknown',
      showtime: showtimeData?.showtime || 'Unknown',
      screen: showtimeData?.screen_id || 'Unknown',
      theater: showtimeData?.theater_name || 'Unknown',
    };
  });
});

const filteredTickets = computed(() => {
  if (!searchQuery.value.trim()) {
    return enhancedTickets.value;
  }
  const query = searchQuery.value.toLowerCase().trim();
  return enhancedTickets.value.filter(ticket => {
    const idMatch = ticket.id.toString().includes(query);
    const userNameMatch = showTicketsAction.value && ticket.user_name?.toLowerCase().includes(query);
    return idMatch || userNameMatch;
  });
});

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredTickets.value.slice(start, end);
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};

const formatPaymentMethod = (method) => {
  return method.split('_').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const formatShowtime = (showtimeString) => {
  const date = new Date(showtimeString);
  return isNaN(date) ? 'Invalid time' : new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getStatusClass = (status) => {
  const baseClasses = 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'confirmed':
      return `${baseClasses} bg-green-300 text-green-800`;
    case 'pending':
      return `${baseClasses} bg-yellow-300 text-yellow-800`;
    case 'cancelled':
      return `${baseClasses} bg-red-300 text-red-800`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`;
  }
};

const fetchTickets = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`http://localhost:3001/Tickets?_sort=-status,-created_at${showTicketsAction.value ? '' : `&user_id=${user.value?.id}`}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }
    tickets.value = await response.json();

    try {
      await fetchShowtimeData();
    } catch (err) {
      console.error(err)
    }
  } catch (err) {
    error.value = err.message || 'Failed to load tickets';
    console.error('Error fetching tickets:', err);
  } finally {
    loading.value = false;
  }
};

const fetchShowtimeData = async () => {
  const showtimeIds = [...new Set(tickets.value.map(ticket => ticket.showtime_id))];
  if (showtimeIds.length === 0) return;

  try {
    const showtimePromises = showtimeIds.map(async (id) => {
      const response = await fetch(`http://localhost:3001/Showtimes?id=${id}`);
      if (!response.ok) {
        console.warn(`Failed to fetch showtime ${id}: ${response.statusText}`);
        return null;
      }
      return response.json();
    });

    const showtimeResults = await Promise.all(showtimePromises);

    const showtimeMap = {};
    showtimeResults.forEach((result) => {
      if (result && result.length > 0) {
        const showtime = result[0];
        showtimeMap[showtime.id] = showtime;
      }
    });

    showtimes.value = showtimeMap;
  } catch (err) {
    console.error('Error fetching showtime data:', err);
  }
};

const updateStatus = async (ticket, newStatus) => {
  const ticketId = ticket?.id
  const showtimeId = ticket?.showtime_id

  updating.value = ticketId;
  error.value = null;

  try {
    const ticket = tickets.value.find(t => t.id === ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const updatedTicket = {
      ...ticket,
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    const response = await fetch(`http://localhost:3001/Tickets/${ticketId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTicket)
    });

    if (newStatus === 'cancelled') {
      removeSeatReservation(showtimeId, ticket?.seat_code)
    }

    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.statusText}`);
    }

    const updatedData = await response.json();
    const ticketIndex = tickets.value.findIndex(t => t.id === ticketId);
    if (ticketIndex !== -1) {
      tickets.value[ticketIndex] = updatedData;
    }

    toast.add({
      title: 'Ticket status updated successfully',
      description:  `${updatedTicket.status === 'confirmed' ? 'Confirmed ticket!' : 'Cancelled ticket!'}`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (err) {
    error.value = err.message || 'Failed to update ticket status';
    console.error('Error updating ticket status:', err);
    toast.add({
      title: 'Error',
      description: err,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  } finally {
    updating.value = null;
  }
};

const openBillImage = (billLink) => {
  if (billLink) {
    currentBillImage.value = billLink
    isBillModalOpen.value = true
  } else {
    toast.add({
      title: 'Error',
      description: 'No bill image available',
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
}

const handleImageError = () => {
  toast.add({
    title: 'Error',
    description: `Invalid bill image link: ${currentBillImage.value}`,
    color: 'error',
    icon: 'i-heroicons-x-circle'
  })
}

const changeBillImage = async (ticketId) => {
  await $fetch(`http://localhost:3001/Tickets/${ticketId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      bill_link: currentBillImage.value,
      updated_at: new Date().toISOString()
    }
  });

  toast.add({
    title: 'Bill image updated successfully!',
    color: 'success',
    icon: 'i-heroicons-check-circle'
  })
}

const removeSeatReservation = async (showtimeId, seatName) => {
  const showtimeData = await $fetch(`http://localhost:3001/Showtimes/${showtimeId}`);

  const newOccupiedSeats = showtimeData.seat_reservations.filter((name) => name !== seatName)
  await $fetch(`http://localhost:3001/Showtimes/${showtimeId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      seat_reservations: newOccupiedSeats,
      updated_at: new Date().toISOString()
    }
  });
}

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  fetchTickets();
});
</script>
