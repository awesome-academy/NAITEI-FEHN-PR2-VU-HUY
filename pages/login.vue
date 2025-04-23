<template>
  <div class="flex items-start justify-center px-4">
    <div class="w-full max-w-sm text-white">
      <PageTitle>LOGIN</PageTitle>
      <form @submit.prevent="handleLogin" class="space-y-6">
        <InputField
          v-model="email"
          label="Email"
          placeholder="Enter your email"
        />
        <InputField
          v-model="password"
          label="Password"
          type="password"
          placeholder="・・・・・・・"
        />
        <Checkbox v-model="keepSignedIn" label="Keep me signed in" />
        <div class="flex flex-col items-center justify-center space-y-2">
          <Button type="submit">Login</Button>
          <p class="text-sm">
            Don't have an account? Register
            <NuxtLink to="/register" class="text-blue-400">here</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const keepSignedIn = ref(false)

const { login } = useAuth()
const toast = useToast()

const handleLogin = async () => {
  const { success, error, user } = await login(email.value, password.value, keepSignedIn.value)

  if (success) {
    toast.add({
      title: 'Login Successful',
      description: `Welcome back, ${user.name}!`,
      color: 'success',
      icon: 'flat-color-icons:ok',
    })
    window.location.href = '/'
  } else {
    toast.add({
      title: 'Login Failed',
      description: error || 'Invalid email or password.',
      color: 'error',
      icon: 'ix:error-filled'
    })
  }
}
</script>
