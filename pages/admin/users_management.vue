<template>
  <div class="px-4 max-w-6xl mx-auto">
    <PageTitle>USERS LIST</PageTitle>

    <div v-if="loading" class="text-center text-white py-8">
      Loading...
    </div>
    <!-- Users Table -->
    <div v-else class="flex items-center justify-center">
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="p-2 text-left">Email</th>
            <th class="p-2 text-left">Phone</th>
            <th class="p-2 text-left">Name</th>
            <th class="p-2 text-center">Role</th>
            <th class="p-2 text-center">Status</th>
            <th class="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="hover:bg-gray-800 border-b">
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">{{ user.phone }}</td>
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2 text-center">
              <UBadge v-if="user.role === 'admin'" variant="subtle" color="info">Admin</UBadge>
              <UBadge v-else variant="subtle" color="neutral">User</UBadge>
            </td>
            <td class="p-2 text-center">
              <UBadge v-if="user.status === 'active'" variant="subtle" color="primary">Active</UBadge>
              <UBadge v-else variant="subtle" color="error">Deactivated</UBadge>
            </td>
            <td class="p-2 text-center">
              <UButton
                :color="user.status === 'active' ? 'error' : 'secondary'"
                :icon="user.status === 'active' ? 'mdi-light:lock' : 'basil:unlock-solid'"
                size="md"
                variant="ghost"
                @click="toggleUserStatus(user)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-center">
      <UPagination
        v-model:page="currentPage"
        :total="users.length"
        :items-per-page="pageSize"
        active-color="secondary"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const loading = ref(true)
const users = ref([])
const currentPage = ref(1)
const pageSize = 5

const toast = useToast()

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return users.value.slice(start, end)
})

async function fetchUsers() {
  try {
    const response = await $fetch('http://localhost:3001/Users')
    users.value = response
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

async function toggleUserStatus(user) {
  const index = users.value.findIndex(u => u.id === user.id)
  if (index === -1) return

  const originalStatus = users.value[index].status
  const newStatus = originalStatus === 'active' ? 'inactive' : 'active'

  // Optimistically update local state
  users.value[index].status = newStatus

  try {
    await $fetch(`http://localhost:3001/Users/${user.id}`, {
      method: 'PATCH',
      body: { status: newStatus, updated_at: new Date().toISOString() }
    })

    toast.add({
      title: 'Update successfully',
      description:  `${newStatus === 'active' ? 'User activated!' : 'User deactivated!'}`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } catch (error) {
    users.value[index].status = originalStatus
    toast.add({
      title: 'Error',
      description: error,
      color: 'error',
      icon: 'i-heroicons-x-circle'
    })
  }
}

fetchUsers()
</script>
