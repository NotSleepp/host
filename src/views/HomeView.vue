<script setup>
import { useAuthStore } from '../stores/authStore'
import { useMenuStore } from '../stores/menuStore'

const authStore = useAuthStore()
const menuStore = useMenuStore()
</script>

<template>
  <div class="home-container">
    <div class="dashboard-header">
      <h1>Dashboard Principal</h1>
    </div>
    
    <div class="dashboard-content">
      <div class="welcome-card">
        <div class="welcome-icon">
          <span>✔</span>
        </div>
        <div class="welcome-text">
          <h2>Bienvenido, <strong>{{ authStore.username }}</strong></h2>
          <p>Este es el shell principal de la aplicación de micro-frontends.</p>
          <p>Utiliza el menú lateral para navegar a los diferentes módulos.</p>
        </div>
      </div>
      
      <div class="dashboard-grid">
        <div class="info-card">
          <div class="card-header">
            <h3>Información del Sistema</h3>
          </div>
          <div class="card-body">
            <p>Este dashboard funciona como un shell/host para varios micro-frontends.</p>
            <p>Utiliza Vite + Vue 3 + Module Federation para cargar módulos remotos.</p>
          </div>
        </div>
        
        <div class="info-card">
          <div class="card-header">
            <h3>Estado del Sistema</h3>
          </div>
          <div class="card-body">
            <div class="status-item">
              <span class="status-label">Estado:</span>
              <span class="status-value status-online">Online</span>
            </div>
            <div class="status-item">
              <span class="status-label">Versión:</span>
              <span class="status-value">1.0.0</span>
            </div>
            <div class="status-item">
              <span class="status-label">Módulos:</span>
              <span class="status-value">{{ menuStore.getMenuItems.length || 0 }} cargados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.dashboard-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #edf2f7;
}

.dashboard-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.dashboard-content {
  padding: 2rem;
  flex: 1;
}

.welcome-card {
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.welcome-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #48bb78, #38a169);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin-right: 1.5rem;
}

.welcome-text h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.welcome-text p {
  color: #4a5568;
  margin-bottom: 0.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #edf2f7;
  background-color: #f8fafc;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
}

.card-body {
  padding: 1.5rem;
  color: #4a5568;
}

.card-body p {
  margin-bottom: 0.75rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 500;
  color: #64748b;
}

.status-value {
  font-weight: 600;
}

.status-online {
  color: #38a169;
}
</style>
