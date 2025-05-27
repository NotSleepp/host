<script setup>
import { useAuthStore } from './stores/authStore'
import SideBarMenu from './components/SideBarMenu.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-container">
    <!-- Header (solo visible cuando está autenticado) -->
    <header class="app-header" v-if="authStore.isAuthenticated">
      <div class="header-logo">
        <h1 class="text-xl font-bold">Mi Dashboard</h1>
      </div>
      
      <div class="header-actions">
        <span class="user-info">{{ authStore.username }}</span>
        <button @click="handleLogout" class="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </header>
    
    <div class="app-body">
      <!-- Sidebar (solo visible cuando está autenticado) -->
      <aside v-if="authStore.isAuthenticated" class="app-sidebar">
        <SideBarMenu />
      </aside>
      
      <!-- Main Content (ajusta ancho según autenticación) -->
      <main :class="{'app-content': true, 'app-content-full': !authStore.isAuthenticated}">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #2d3748;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  height: 60px;
  z-index: 100;
}

.header-logo h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.header-logo h1:before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: inline-block;
  margin-right: 10px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  font-weight: 500;
  color: #4a5568;
  display: flex;
  align-items: center;
}

.user-info:before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #48bb78;
  display: inline-block;
  margin-right: 8px;
}

.logout-btn {
  background-color: white;
  color: #e53e3e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  border: 1px solid #e53e3e;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #e53e3e;
  color: white;
}

.app-body {
  display: flex;
  flex: 1;
  background-color: #f7fafc;
  height: calc(100vh - 60px);
}

.app-sidebar {
  width: 250px;
  background-color: white;
  box-shadow: 3px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 50;
  border-right: 1px solid #edf2f7;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.app-content {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

.app-content-full {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
