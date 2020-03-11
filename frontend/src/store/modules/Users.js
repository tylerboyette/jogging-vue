import * as constants from '@/store/constants'
import UserService  from '@/services/UserService'

// initial state
const state = {
  users: [],
}

// getters
const getters = {
  users: state => state.users,
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
    const _data = Object.assign({}, data)
    return UserService.create(_data)
    .then(({ data }) => {
      commit(constants.ADD_USER, data)
      return data
    })
  },
  [constants.ACTION_UPDATE_USER] ({ commit }, { id, data }) {
    const _data = Object.assign({}, data)
    return UserService.update(id, _data)
    .then(({ data }) => {
      commit(constants.UPDATE_USER, data)
      return data
    })
  },
  [constants.ACTION_DELETE_USER] ({ commit }, id) {
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
  },
  [constants.SET_USERS] (state, users) {
    state.users = users
  },
  [constants.ADD_USER] (state, user) {
    let users = state.users;
    users.push(user);
    state.users = users;
  },
  [constants.DELETE_USER] (state, user) {
    let users = state.users.filter(item=>item._id!=user._id);
    state.users = users;
  },
  [constants.UPDATE_USER] (state, user) {
    let users = state.users;
    users = users.map(item=>{
      if(item._id===user._id){
        item = user;
        return item;
      }
      return item;
    })
    state.users = users
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
