import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/App/Layout.vue'
import UserList from '../views/App/UserList.vue'
import EntryList from '../views/App/EntryList.vue'
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
  { path: '/logout', name: 'logout', meta: { skipAuth: true},  component: () => import(/* webpackChunkName: "about" */ '../views/App/Logout.vue')},
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    children:[
      { path:'', redirect:{name:'user-list'}, name:'index'},
      { path: 'users', name: 'user-list', component: UserList, meta: { manager: true } },
      { path: 'entries', name: 'entry-list', component: EntryList, meta: { manager: true } },
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
        name: 'user-list',
      })
      return
    }
  }
  next()
})

export default router
