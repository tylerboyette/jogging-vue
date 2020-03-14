import * as constants from '@/store/constants'
import UserService  from '@/services/UserService'

// initial state
const state = {
  users: [],
  loading: false,
}

// getters
const getters = {
  users: state => state.users,
  userLoading: state => state.loading,
}

// actions
const actions = {
  [constants.ACTION_GET_USERS] ({ commit }) {
    commit(constants.CLEAR_USERS)
    return UserService.list()
    .then(({ data }) => {
      commit(constants.SET_USERS, data)
      return data
    })
  },
  [constants.ACTION_ADD_USER] ({ commit }, data) {
    commit(constants.SET_USER_LOADING)
    const _data = Object.assign({}, data)
    return UserService.create(_data)
    .then(({ data }) => {
      commit(constants.ADD_USER, data)
      return data
    })
  },
  [constants.ACTION_UPDATE_USER] ({ commit }, { id, data }) {
    commit(constants.SET_USER_LOADING)
    const _data = Object.assign({}, data)
    return UserService.update(id, _data)
    .then(({ data }) => {
      commit(constants.UPDATE_USER, data)
      return data
    })
  },
  [constants.ACTION_DELETE_USER] ({ commit }, id) {
    commit(constants.SET_USER_LOADING)
    return UserService.delete(id)
    .then(({ data }) => {
      commit(constants.DELETE_USER, data)
      return data;
    })
  },
}

// mutations
const mutations = {
  [constants.CLEAR_USERS] (state) {
    state.users = []
    state.loading = true
  },
  [constants.SET_USER_LOADING] (state) {
    state.loading = true
  },
  [constants.SET_USERS] (state, users) {
    state.users = users
    state.loading = false
  },
  [constants.ADD_USER] (state, user) {
    let users = state.users;
    users.push(user);
    state.users = users;
    state.loading = false
  },
  [constants.DELETE_USER] (state, user) {
    let users = state.users.filter(item=>item._id!=user._id);
    state.users = users;
    state.loading = false
  },
  [constants.UPDATE_USER] (state, user) {
    let users = state.users;
    users = users.map(item=>{
      if(item._id===user._id) item = user;
      return item;
    })
    state.users = users
    state.loading = false
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
