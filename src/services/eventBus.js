/**
 * Servicio de bus de eventos para la comunicación entre el shell y los micro-frontends
 * Implementa un patrón pub/sub simple para la comunicación entre componentes
 */

class EventBus {
  constructor() {
    this.events = {}
  }

  /**
   * Suscribe una función callback a un evento específico
   * @param {string} event - Nombre del evento
   * @param {Function} callback - Función a ejecutar cuando el evento ocurra
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    
    this.events[event].push(callback)
    
    // Retorna una función para desuscribirse
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }

  /**
   * Emite un evento con datos opcionales
   * @param {string} event - Nombre del evento
   * @param {any} data - Datos a pasar a los suscriptores
   */
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data)
      })
    }
    
    // También emitir como evento DOM para compatibilidad con otros micro-frontends
    window.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

  /**
   * Elimina todos los suscriptores de un evento
   * @param {string} event - Nombre del evento (opcional, si no se proporciona, se limpian todos)
   */
  off(event) {
    if (event) {
      delete this.events[event]
    } else {
      this.events = {}
    }
  }
}

// Exportamos una instancia única para toda la aplicación
export default new EventBus()
