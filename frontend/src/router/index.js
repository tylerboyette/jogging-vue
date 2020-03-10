import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Auth/Login.vue'
import Dashboard from '../views/App/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/login',
    name: 'login',
    meta: { skipAuth: true},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { skipAuth: true},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Signup.vue')
  },
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => !record.meta.skipAuth)) {
    if (!localStorage.getItem('token')) {
      next({
        name: 'login',
      })
      return
    }
  }
  if (to.matched.some(record => record.meta.manage)) {
    const userRole = parseInt(localStorage.setItem('user-role'))
    if (!userRole) {
      next({
        name: 'record-list',
      })
      return
    }
  }
  next()
})

export default router
