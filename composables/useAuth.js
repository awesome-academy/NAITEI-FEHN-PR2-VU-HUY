import { ref, computed } from 'vue';

export const useAuth = () => {
  const user = ref(null);

  if (import.meta.client) {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch (err) {
        console.error('Failed to parse localStorage user:', err);
        localStorage.removeItem('auth_user');
      }
    }
  }

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => isAuthenticated && user?.value?.role === 'admin')

  const register = async (name, email, phone, password) => {
    try {
      const { data: existingUsers, error: checkError } = await useFetch(
        `http://localhost:3001/User?email=${email}`,
        { method: 'GET' }
      );

      if (checkError.value) {
        console.error('Check error:', checkError.value);
        throw new Error('Error checking email availability');
      }

      if (existingUsers.value && existingUsers.value.length > 0) {
        throw new Error('Email is already registered');
      }

      const currentTimestamp = new Date().toUTCString()

      const { error } = await useFetch('http://localhost:3001/User', {
        method: 'POST',
        body: { name, email, phone, password, role: "user", status: "active", created_at: currentTimestamp, updated_at: currentTimestamp},
      });

      if (error.value) {
        console.error('Register error:', error.value);
        throw new Error('Error registering user');
      }

      return await login(email, password);
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await useFetch(
        `http://localhost:3001/User?email=${email}&password=${password}`,
        { method: 'GET' }
      );

      if (error.value) {
        console.error('Fetch error:', error.value);
        throw new Error('Error fetching from server');
      }

      const users = data.value;

      if (users && users.length > 0) {
        user.value = users[0];

        if (import.meta.client) {
          const userData = JSON.stringify(user.value);
          localStorage.setItem('auth_user', userData);
        }

        return { success: true, user: user.value };
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    user.value = null;
    if (import.meta.client) {
      localStorage.removeItem('auth_user');
    }
  };

  return {
    user,
    isAuthenticated,
    isAdmin,
    register,
    login,
    logout,
  };
};
