import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuItems: []
  }),
  
  actions: {
    addMenuItem(item) {
      // Avoid duplicates by checking if an item with the same path already exists
      const exists = this.menuItems.some(existingItem => existingItem.path === item.path)
      if (!exists) {
        this.menuItems.push(item)
      }
    },
    
    addMenuItems(items) {
      if (Array.isArray(items)) {
        items.forEach(item => this.addMenuItem(item))
      }
    },
    
    removeMenuItem(path) {
      this.menuItems = this.menuItems.filter(item => item.path !== path)
    },
    
    clearMenuItems() {
      this.menuItems = []
    }
  },
  
  getters: {
    getMenuItems: (state) => state.menuItems
  }
})
