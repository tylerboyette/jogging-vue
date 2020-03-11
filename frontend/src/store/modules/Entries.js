import * as constants from '@/store/constants'
import EntryService  from '@/services/EntryService'

// initial state
const state = {
  entries: [],
}

// getters
const getters = {
  entries: state => state.entries,
}

// actions
const actions = {
  [constants.ACTION_GET_ENTRIES] ({ commit }) {
    commit(constants.CLEAR_ENTRIES)
    return EntryService.list()
    .then(({ data }) => {
      commit(constants.SET_ENTRIES, data)
      return data
    })
  },
  [constants.ACTION_ADD_ENTRY] ({ commit }, data) {
    const _data = Object.assign({}, data)
    return EntryService.create(_data)
    .then(({ data }) => {
      commit(constants.ADD_ENTRY, data)
      return data
    })
  },
  [constants.ACTION_UPDATE_ENTRY] ({ commit }, { id, data }) {
    const _data = Object.assign({}, data)
    return EntryService.update(id, _data)
    .then(({ data }) => {
      commit(constants.UPDATE_ENTRY, data)
      return data
    })
  },
  [constants.ACTION_DELETE_ENTRY] ({ commit }, id) {
    return EntryService.delete(id)
    .then(({ data }) => {
      commit(constants.DELETE_ENTRY, data)
      return data;
    })
  },
}

// mutations
const mutations = {
  [constants.CLEAR_ENTRIES] (state) {
    state.entries = []
  },
  [constants.SET_ENTRIES] (state, entries) {
    state.entries = entries
  },
  [constants.ADD_ENTRY] (state, entry) {
    let entries = state.entries;
    entries.push(entry);
    state.entries = entries;
  },
  [constants.DELETE_ENTRY] (state, entry) {
    let entries = state.entries.filter(item=>item._id!=entry._id);
    state.entries = entries;
  },
  [constants.UPDATE_ENTRY] (state, entry) {
    let entries = state.entries;
    entries = entries.map(item=>{
      if(item._id===entry._id) item = entry;
      return item;
    })
    state.entries = entries
  },
}

export default {
  state,
  getters,
  actions,
  mutations
}
