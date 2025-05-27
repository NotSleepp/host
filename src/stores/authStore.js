import { defineStore } from 'pinia'
import eventBus from '../services/eventBus'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    username: '',
    userRole: '',
    lastLogin: null,
    loginError: null
  }),
  
  actions: {
    login(username, rememberMe = false) {
      this.isAuthenticated = true
      this.username = username
      this.userRole = 'user' // Por defecto, se puede cambiar según la respuesta de la API
      this.lastLogin = new Date()
      this.loginError = null
      
      // Guardar en localStorage si rememberMe está activado
      if (rememberMe) {
        localStorage.setItem('auth', JSON.stringify({
          username,
          lastLogin: this.lastLogin
        }))
      }
      
      // Emitir evento de login exitoso
      eventBus.emit('authChanged', true)
      eventBus.emit('userLoggedIn', { username, role: this.userRole })
      
      return true
    },
    
    loginFailed(error) {
      this.loginError = error || 'Error de autenticación'
      return false
    },
    
    logout() {
      this.isAuthenticated = false
      this.username = ''
      this.userRole = ''
      this.loginError = null
      
      // Limpiar localStorage
      localStorage.removeItem('auth')
      
      // Emitir evento de logout
      eventBus.emit('authChanged', false)
      eventBus.emit('userLoggedOut')
      
      return true
    },
    
    checkSavedAuth() {
      try {
        const savedAuth = JSON.parse(localStorage.getItem('auth'))
        if (savedAuth && savedAuth.username) {
          this.login(savedAuth.username)
          return true
        }
      } catch (e) {
        console.error('Error al recuperar la sesión guardada:', e)
        localStorage.removeItem('auth')
      }
      return false
    },
    
    updateUserRole(role) {
      this.userRole = role
      eventBus.emit('userRoleChanged', role)
    }
  },
  
  getters: {
    userIsAuthenticated: (state) => state.isAuthenticated,
    currentUsername: (state) => state.username,
    getUserRole: (state) => state.userRole,
    getLoginError: (state) => state.loginError,
    getLastLogin: (state) => state.lastLogin
  }
})
