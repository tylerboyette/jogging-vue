import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/App/Layout.vue'
import Dashboard from '../views/App/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { skipAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Login.vue')
  },
  {
    path: '/signup',
    name: 'signup',
    meta: { skipAuth: true},
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Signup.vue')
  },
  {
    path: '/verify/:token',
    name: 'verify',
    meta: { skipAuth: true},
    props: true,
    component: () => import(/* webpackChunkName: "about" */ '../views/Auth/Verify.vue')
  },
  { path: '/logout', name: 'logout', meta: { skipAuth: true},  component: () => import(/* webpackChunkName: "about" */ '../views/App/Logout.vue')},
  {
    path: '/',
    component: Layout,
    children:[
      { path:'', redirect:{name:'dashboard'}, name:'index'},
      { path: 'users', name: 'user-list',  component: () => import(/* webpackChunkName: "about" */ '../views/App/UserList.vue'), meta: { manager: true } },
      { path: 'entries', name: 'entry-list', component: () => import(/* webpackChunkName: "about" */ '../views/App/EntryList.vue'), meta: { manager: true } },
      { path: 'report', name: 'reports',  component: () => import(/* webpackChunkName: "about" */ '../views/App/Report.vue'), meta: { manager: true } },
      { path: 'settings', name: 'settings',  component: () => import(/* webpackChunkName: "about" */ '../views/App/Profile.vue')},
      { path: 'dashboard', name: 'dashboard', component: Dashboard },
    ]
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
    const userRole = localStorage.setItem('user-role')
    if (userRole!=='user') {
      next({
        name: '',
      })
      return
    }
  }
  next()
})

export default router
