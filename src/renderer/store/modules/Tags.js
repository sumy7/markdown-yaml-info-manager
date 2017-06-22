import * as types from '../mutation-types'

const state = {
  tags: {}
}

const mutations = {
  [types.CLEAR_TAGS](state) {
    state.tags = {}
  },
  [types.ADD_TAG](state, { article }) {
    for (let tag of article.tags) {
      if (state.tags[tag]) {
        state.tags[tag].push(article.id)
      } else {
        state.tags[tag] = [article.id]
      }
    }
  }
}

const actions = {

}

const getters = {
  tagsList(state) {
    return state.tags
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
