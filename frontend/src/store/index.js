import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Auth from './modules/Auth.js'
import User from './modules/Users'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Auth,
    User
  },
  plugins:[createPersistedState()]
})
