import * as constants from '@/store/constants'
import ProfileService  from '@/services/ProfileService'

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
  [constants.ACTION_SET_PROFILE] ({ commit },data) {
    const _data = Object.assign({}, data)
    return ProfileService.update(_data)
    .then(({ data }) => {
      commit(constants.SET_CURRENT_USER, data)
      return data
    })
  },
}

// mutations
const mutations = {
  [constants.SET_CURRENT_USER] (state, user) {
    state.user = user
    if (user) {
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
