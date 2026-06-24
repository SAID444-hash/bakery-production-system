import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin', 'baker']
      }
    },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue'),
      meta: {
        requiresAuth: true,
        roles: ['admin', 'cashier']
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    }
  ]
})

// Navigation Guard
router.beforeEach((to) => {
  const token = localStorage.getItem('auth_token')
  const user = JSON.parse(localStorage.getItem('auth_user') || 'null')

  // If route requires authentication and user is not logged in
  if (to.meta.requiresAuth && !token) {
    return { name: 'login' }
  }

  // If route requires specific roles
  if (to.meta.roles) {
    if (!user || !to.meta.roles.includes(user.role)) {
      return { name: 'dashboard' }
    }
  }

  // If already logged in and trying to access login page
  if (to.name === 'login' && token) {
    return { name: 'dashboard' }
  }

  return true
})

export default router