<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMenuStore } from '../stores/menuStore'
import eventBus from '../services/eventBus'
import { useAuthStore } from '../stores/authStore'

const menuStore = useMenuStore()
const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const loadError = ref(null)

// Función para cargar los menús del micro-frontend Admin
const loadAdminMenuItems = async () => {
  isLoading.value = true
  loadError.value = null
  
  try {
    // Importar los items de menú del MFE Admin
    const { getAdminMenuItems } = await import('adminMFE/adminMenuConfig')
    const adminMenuItems = await getAdminMenuItems()
    
    // Añadir los items al store
    menuStore.addMenuItems(adminMenuItems)
    
    // Notificar que se han cargado los items del menú
    eventBus.emit('shellMenuLoaded', { source: 'dashboardShell', items: adminMenuItems })
  } catch (error) {
    console.error('Error loading admin menu items:', error)
    loadError.value = error
  } finally {
    isLoading.value = false
  }
}

// Manejador para el evento de nuevos items de menú
const handleNewMenuItemAdded = (data) => {
  if (data) {
    menuStore.addMenuItem(data)
    
    // Log para depuración
    console.log('Nuevo item de menú añadido:', data)
  }
}

// Navegar a la ruta cuando se hace clic en un item de menú
const navigateTo = (path) => {
  router.push(path)
  
  // Notificar sobre la navegación mediante el EventBus
  eventBus.emit('shellNavigated', { path, username: authStore.username })
}

// Recargar menús
const reloadMenus = () => {
  menuStore.clearMenuItems()
  loadAdminMenuItems()
}

onMounted(() => {
  // Cargar items de menú inicial
  loadAdminMenuItems()
  
  // Suscribirse a eventos mediante el EventBus
  const unsubscribe = eventBus.on('newMenuItemAdded', handleNewMenuItemAdded)
  
  // También mantener la compatibilidad con el enfoque de eventos DOM
  window.addEventListener('newMenuItemAdded', (event) => {
    if (event && event.detail) {
      handleNewMenuItemAdded(event.detail)
    }
  })
  
  // Cuando cambie el estado de autenticación, recargar los menús
  eventBus.on('authChanged', (isAuthenticated) => {
    if (isAuthenticated) {
      reloadMenus()
    } else {
      menuStore.clearMenuItems()
    }
  })
  
  // Limpieza al desmontar
  onUnmounted(() => {
    unsubscribe()
    window.removeEventListener('newMenuItemAdded', handleNewMenuItemAdded)
  })
})
</script>

<template>
  <div class="sidebar-menu">
    <div class="menu-header">
      <span class="menu-title">Navegación</span>
    </div>
    
    <nav>
      <ul class="menu-list">
        <li class="menu-item">
          <router-link to="/" class="menu-link">
            <span class="menu-icon home-icon"></span>
            <span>Inicio</span>
          </router-link>
        </li>
        
        <!-- Items dinámicos del store -->
        <li v-for="(item, index) in menuStore.getMenuItems" :key="index" class="menu-item">
          <a 
            :href="item.path" 
            class="menu-link"
            @click.prevent="navigateTo(item.path)"
          >
            <span class="menu-icon module-icon"></span>
            <span>{{ item.title }}</span>
          </a>
        </li>
      </ul>
    </nav>
    
    <div class="menu-footer">
      <div class="user-profile" v-if="authStore.isAuthenticated">
        <div class="user-avatar">
          <span>{{ authStore.username.charAt(0).toUpperCase() }}</span>
        </div>
        <div class="user-info">
          <div class="username">{{ authStore.username }}</div>
          <div class="user-role">{{ authStore.getUserRole || 'Usuario' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.menu-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #edf2f7;
}

.menu-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-list {
  width: 100%;
  padding: 1rem 0;
  flex: 1;
}

.menu-item {
  width: 100%;
  margin-bottom: 0.25rem;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #4a5568;
  width: 100%;
  text-align: left;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
}

.home-icon::before {
  content: '⌂';
  font-size: 1.1rem;
}

.module-icon::before {
  content: '◉';
  font-size: 0.95rem;
}

.menu-link:hover {
  background-color: #f7fafc;
  color: #4299e1;
  border-left-color: #4299e1;
}

.menu-link:hover .menu-icon {
  opacity: 1;
}

.router-link-active {
  background-color: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
  border-left-color: #3182ce;
}

.router-link-active .menu-icon {
  opacity: 1;
}

.menu-footer {
  margin-top: auto;
  padding: 1rem 1.5rem;
  border-top: 1px solid #edf2f7;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  font-size: 1rem;
}

.username {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  color: #718096;
  font-size: 0.8rem;
}
</style>
