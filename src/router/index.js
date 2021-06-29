import Vue from 'vue'
import { auth } from '@/firebase'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import( /* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Smart Monteiro'
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Settings.vue'),
    meta: {
      requiresAuth: true,
      title: 'Configurações'
    }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Help.vue'),
    meta: {
      requiresAuth: true,
      title: 'Ajuda'
    }
  },
  {
    path: '/rides',
    name: 'Rides',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Rides.vue'),
    meta: {
      requiresAuth: true,
      title: 'Carona Solidária'
    }
  },
  {
    path: '/parkeds',
    name: 'Parkeds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/Parkeds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Estacione Aqui'
    }
  },
  {
    path: '/organicAds',
    name: 'OrganicAds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/OrganicAds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Orgânicos'
    }
  },
  {
    path: '/garbageAds',
    name: 'GarbageAds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/GarbageAds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Coleta'
    }
  },
  {
    path: '/admin/rides',
    name: 'AdminRides',
    component: () => import( /* webpackChunkName: "settings" */ '../views/admin/Rides.vue'),
    meta: {
      requiresAuth: true,
      title: 'Carona Solidária'
    }
  },
  {
    path: '/admin/parkeds',
    name: 'AdminParkeds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/admin/Parkeds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Estacione Aqui'
    }
  },
  {
    path: '/admin/organicAds',
    name: 'AdminOrganicAds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/admin/OrganicAds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Orgânicos'
    }
  },
  {
    path: '/admin/garbageAds',
    name: 'AdminGarbageAds',
    component: () => import( /* webpackChunkName: "settings" */ '../views/admin/GarbageAds.vue'),
    meta: {
      requiresAuth: true,
      title: 'Coleta'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router