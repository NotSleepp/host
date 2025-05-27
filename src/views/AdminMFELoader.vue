<script setup>
import { defineAsyncComponent, onMounted, ref, onErrorCaptured } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)
const retryCount = ref(0)
const maxRetries = 3

// Definimos el componente con opciones de error handling
const AdminApp = defineAsyncComponent({
  loader: () => import('adminMFE/AdminApp'),
  delay: 200,
  timeout: 10000,
  errorComponent: null, // Manejamos el error nosotros mismos
  onError: (err, retry, fail, attempts) => {
    error.value = err
    retryCount.value = attempts
    console.error(`Error loading Admin MFE (attempt ${attempts}):`, err)
    
    if (attempts <= maxRetries) {
      // Intenta cargar de nuevo después de un retraso
      setTimeout(() => {
        retry()
      }, 1000 * attempts) // Backoff exponencial básico
    } else {
      fail()
    }
  }
})

onMounted(() => {
  loading.value = true
})

// Captura errores del componente
onErrorCaptured((err) => {
  error.value = err
  console.error('Error en componente Admin MFE:', err)
  return false // Evita que el error se propague
})

// Función para volver al dashboard
const returnToDashboard = () => {
  router.push('/')
}
</script>

<template>
  <div class="admin-mfe-container">
    <div v-if="error" class="error-container">
      <h2 class="text-red-500 text-xl">Error al cargar el módulo Admin</h2>
      <p>{{ error.message || 'No se pudo cargar el módulo. Por favor, inténtelo más tarde.' }}</p>
      
      <div class="error-actions">
        <p v-if="retryCount > 0" class="retry-info">
          Intentos de reconexión: {{ retryCount }}/{{ maxRetries }}
        </p>
        
        <button 
          @click="returnToDashboard" 
          class="return-btn"
        >
          Volver al Dashboard
        </button>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="text-gray-500">Cargando módulo Admin...</p>
    </div>
    
    <AdminApp v-else />
  </div>
</template>

<style scoped>
.admin-mfe-container {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.error-container, .loading-container {
  padding: 2rem;
  text-align: center;
}

.error-container {
  background-color: #fee2e2;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

.error-actions {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.retry-info {
  color: #b91c1c;
  font-size: 0.875rem;
}

.return-btn {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.return-btn:hover {
  background-color: #1d4ed8;
}

.loading-spinner {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  margin-bottom: 1rem;
  border: 0.25rem solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
