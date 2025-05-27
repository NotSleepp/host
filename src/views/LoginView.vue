<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import eventBus from '../services/eventBus'

const authStore = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isLoading = ref(false)

// Verificar si hay una sesión guardada al cargar el componente
onMounted(() => {
  // Intenta recuperar la sesión guardada
  if (authStore.checkSavedAuth()) {
    router.push('/')
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    authStore.loginFailed('Por favor ingresa usuario y contraseña')
    return
  }
  
  isLoading.value = true
  
  try {
    // Simulación de llamada a API (en un caso real, sería una llamada asíncrona)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Login exitoso
    authStore.login(username.value, rememberMe.value)
    eventBus.emit('loginSuccess', { username: username.value })
    router.push('/')
  } catch (error) {
    // Error de login
    authStore.loginFailed(error.message || 'Error al iniciar sesión')
  } finally {
    isLoading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  username.value = ''
  password.value = ''
  rememberMe.value = false
  router.push('/login')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card" v-if="!authStore.isAuthenticated">
      <div class="login-logo">
        <div class="logo-circle">
          <span>M</span>
        </div>
      </div>
      
      <h1 class="login-title">Iniciar Sesión</h1>
      
      <div v-if="authStore.getLoginError" class="error-message">
        <span class="error-icon">!</span>
        {{ authStore.getLoginError }}
      </div>
      
      <div class="form-group">
        <input 
          id="username"
          v-model="username" 
          type="text" 
          class="login-input"
          placeholder="Usuario"
          @keyup.enter="handleLogin"
        />
      </div>
      
      <div class="form-group">
        <input 
          id="password"
          v-model="password" 
          type="password" 
          class="login-input"
          placeholder="Contraseña"
          @keyup.enter="handleLogin"
        />
      </div>
      
      <div class="remember-me">
        <label class="custom-checkbox">
          <input 
            type="checkbox"
            v-model="rememberMe"
          />
          <span class="checkmark"></span>
          <span class="label-text">Recordarme</span>
        </label>
      </div>
      
      <button 
        @click="handleLogin" 
        class="login-button"
        :disabled="isLoading || !username || !password"
      >
        <span v-if="isLoading" class="loading-spinner"></span>
        <span v-else>{{ isLoading ? 'Iniciando sesión...' : 'Ingresar' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
}

.login-logo {
  margin-bottom: 30px;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.logo-circle span {
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.login-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 30px;
}

.error-message {
  display: flex;
  align-items: center;
  background-color: #fff5f5;
  color: #e53e3e;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  text-align: left;
}

.error-icon {
  background-color: #e53e3e;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  font-size: 0.8rem;
}

.form-group {
  margin-bottom: 20px;
}

.login-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  background-color: #f7fafc;
  outline: none;
}

.login-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background-color: white;
}

.login-input::placeholder {
  color: #a0aec0;
}

.remember-me {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 25px;
  text-align: left;
}

.custom-checkbox {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  font-size: 0.9rem;
  color: #4a5568;
  user-select: none;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  height: 20px;
  width: 20px;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #667eea;
  border-color: #667eea;
}

.checkmark:after {
  content: "";
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  margin-bottom: 2px;
}

.label-text {
  font-size: 0.9rem;
}

.login-button {
  width: 100%;
  padding: 14px;
  border: none;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
