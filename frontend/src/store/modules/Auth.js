import * as constants from '@/store/constants'

// initial state
const state = {
  user: null,
}

// getters
const getters = {
  currentUser: state => state.user,
}

// actions
const actions = {
  [constants.ACTION_SET_CURRENT_USER] ({ commit },data) {
    commit(constants.SET_CURRENT_USER, data)
  },
}

// mutations
const mutations = {
  [constants.SET_CURRENT_USER] (state, user) {
    state.user = user
    if (user) {
      localStorage.setItem('user-role', user.role)
      localStorage.setItem('user-name', user.name)
      localStorage.setItem('token',user.token)
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
