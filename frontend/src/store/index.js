import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import Auth from './modules/Auth'
import User from './modules/Users'
import Entry from './modules/Entries'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    Auth,
    User,
    Entry
  },
  plugins:[createPersistedState()]
})
