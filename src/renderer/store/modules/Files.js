import * as types from '../mutation-types'

const state = {
  directory: '',
  files: []
}

const mutations = {
  [types.CLEAR_FILES](state) {
    state.files = []
  },
  [types.CHANGE_DIRECTORY](state, { directory }) {
    state.directory = directory
  },
  [types.RECEIVE_FILES](state, { files }) {
    state.files = files
  },
  [types.CHANG_FILE_STATE](state, { id, stat }) {
    state.files.forEach((item) => {
      if (item.id === id) {
        item.state = stat
      }
    })
  }
}

const actions = {
  clearFiles({ commit }) {
    commit(types.CLEAR_FILES)
    commit(types.CLEAR_ARTICLES)
  },
  changeDirectory({ dispatch, commit }, directory) {
    dispatch('clearFiles').then(() => {
      commit(types.CHANGE_DIRECTORY, { directory })
    })
  },
  reveiveFiles({ commit }, files) {
    commit(types.RECEIVE_FILES, { files })
  },
  changeFileState({ commit }, { id, state }) {
    commit(types.CHANG_FILE_STATE, { id, stat: state })
  }
}

const getters = {
  directory(state) {
    return state.directory
  },
  files(state) {
    return state.files
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
