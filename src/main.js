import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import routes from './router'

const app = createApp(App)
const pinia = createPinia()

// Crear el router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Inicializar plugins
app.use(pinia)
app.use(router)

// Importar store para usarlo en la navegación
import { useAuthStore } from './stores/authStore'

// Verificar autenticación antes de cada navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Comprobar sesión guardada en el primer acceso
  if (from.name === undefined) {
    authStore.checkSavedAuth()
  }
  
  // Si la ruta es /login, permitir siempre
  if (to.path === '/login') {
    next()
    return
  }
  
  // Para todas las demás rutas, verificar autenticación
  if (!authStore.isAuthenticated) {
    // Si no está autenticado, redirigir al login
    next('/login')
  } else {
    // Si está autenticado, permitir la navegación
    next()
  }
})

// Montar la aplicación
app.mount('#app')

// Exponer algunas funcionalidades para uso por micro-frontends
window.dashboardShell = {
  version: '1.0.0',
  name: 'Dashboard Shell'
}
