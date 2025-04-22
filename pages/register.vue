<template>
  <div class="flex items-start justify-center px-4">
    <div class="w-full max-w-sm text-white">
      <PageTitle>REGISTER</PageTitle>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <InputField
          v-model="name"
          label="Name"
          placeholder="Enter your name"
          :error="errors.name"
        />
        <InputField
          v-model="email"
          label="Email"
          placeholder="Enter your email"
          :error="errors.email"
        />
        <InputField
          v-model="phone"
          label="Phone"
          placeholder="Enter your phone"
          :error="errors.phone"
        />
        <InputField
          v-model="password"
          label="Password"
          type="password"
          placeholder="・・・・・・・"
          :error="errors.password"
        />
        <InputField
          v-model="confirmPassword"
          label="Confirm password"
          type="password"
          placeholder="・・・・・・・"
          :error="errors.confirmPassword"
        />
        <div class="flex flex-col items-center justify-center space-y-2">
          <Button type="submit" :disabled="hasErrors">Register</Button>
          <p class="text-sm">
            Already have an account? Login
            <NuxtLink to="/login" class="text-blue-400">here</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuth } from '~/composables/useAuth';

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

const toast = useToast();
const { register } = useAuth();

const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

const hasErrors = computed(() => {
  return Object.values(errors.value).some((error) => error !== '');
});

const validateForm = () => {
  errors.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  let isValid = true;

  if (!name.value.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  } else if (name.value.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errors.value.email = 'Invalid email format';
    isValid = false;
  }

  const phoneRegex = /^\d{10}$/;
  if (!phone.value.trim()) {
    errors.value.phone = 'Phone number is required';
    isValid = false;
  } else if (!phoneRegex.test(phone.value)) {
    errors.value.phone = 'Phone number must be 10 digits';
    isValid = false;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!password.value) {
    errors.value.password = 'Password is required';
    isValid = false;
  } else if (!passwordRegex.test(password.value)) {
    errors.value.password = 'Password must be at least 8 characters with a letter and a number';
    isValid = false;
  }

  if (!confirmPassword.value) {
    errors.value.confirmPassword = 'Confirm password is required';
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

watch([name, email, phone, password, confirmPassword], () => {
  validateForm();
}, { immediate: true });

const handleRegister = async () => {
  if (!validateForm()) {
    toast.add({
      title: 'Validation Error',
      description: 'Please fix the errors in the form.',
      color: 'error',
      icon: 'ix:error-filled',
    });
    return;
  }

  const { success, error, user } = await register(
    name.value,
    email.value,
    phone.value,
    password.value
  );

  if (success) {
    toast.add({
      title: 'Registration Successful',
      description: `Welcome, ${user.name}!`,
      color: 'success',
      icon: 'flat-color-icons:ok',
    });
    window.location.href = '/';
  } else {
    toast.add({
      title: 'Registration Failed',
      description: error || 'Could not register user.',
      color: 'error',
      icon: 'ix:error-filled',
    });
  }
};
</script>
