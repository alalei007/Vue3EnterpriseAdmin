import { useUserStore } from '@/stores/user'
import { getToken } from '@/utils/storage'
import { el } from 'element-plus/es/locale/index.mjs'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: () => import('@/layout/layout.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/Dashboard.vue'),
        },
        { path: '/system/user', name: 'User', component: () => import('@/views/User.vue') },
        {
          path: '/system/role',
          name: 'UserRole',
          component: () => import('@/views/UserRole.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/AppLogin.vue'),
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/PermissionDenied.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const token = getToken()
  if (to.name !== 'Login' && !token) {
    return '/login'
  }

  if (token && !userStore.userInfo.userId) {
    await userStore.updateUserInfo()
  }

  if (to.name === 'Login' && token) {
    return '/'
  }

  return true
})

export default router
