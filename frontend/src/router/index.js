import { createRouter, createWebHistory } from 'vue-router'
import Dashboardview from '@/views/Dashboardview.vue'
import ProductsView from '@/views/ProductsView.vue'
import SalesView from '@/views/SalesView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard,',
      name: 'Dashboard',
      component: Dashboardviewiew,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
    },
    {
      path: '/'sales,
      name: 'sales',
      component: SalesView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    }
    
  ],
})

export default router
