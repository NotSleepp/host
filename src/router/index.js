import { defineAsyncComponent } from 'vue'

// Importar vistas locales
const HomeView = defineAsyncComponent(() => import('../views/HomeView.vue'))
const LoginView = defineAsyncComponent(() => import('../views/LoginView.vue'))
const AdminMFELoader = defineAsyncComponent(() => import('../views/AdminMFELoader.vue'))

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/admin/:pathMatch(.*)*',
    name: 'admin',
    component: AdminMFELoader
  }
]

export default routes
